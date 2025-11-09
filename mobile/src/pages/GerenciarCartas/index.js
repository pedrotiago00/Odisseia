import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Modal,
    TextInput,
    ScrollView,
    Alert // Importa o Alert nativo
} from 'react-native';

// 1. Importe sua API
//    Usando o caminho que você especificou no erro
import api from '../../servicers/api';

// Componente para renderizar cada carta na lista de gerenciamento
const ItemCartaAdmin = ({ item, onEdit, onDelete }) => (
    <View style={styles.card}>
        <View style={styles.cardInfo}>
            <Text style={styles.cardNome}>{item.nome}</Text>
            <Text style={styles.cardTipo}>{item.tipo} (ID: {item.id})</Text>
        </View>
        <View style={styles.cardAcoes}>
            <TouchableOpacity style={[styles.botaoAcao, styles.botaoEditar]} onPress={() => onEdit(item)}>
                <Text style={styles.botaoTexto}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botaoAcao, styles.botaoDeletar]} onPress={() => onDelete(item.id)}>
                <Text style={styles.botaoTexto}>Deletar</Text>
            </TouchableOpacity>
        </View>
    </View>
);

// Tela Principal
const GerenciarCartasScreen = () => {
    const [cartas, setCartas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false); // Para o "pull-to-refresh"

    // --- Estado do Modal e Formulário ---
    const [modalVisivel, setModalVisivel] = useState(false);
    const [cartaEmEdicao, setCartaEmEdicao] = useState(null); // Guarda a carta inteira
    
    // Campos do formulário
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imagemUrl, setImagemUrl] = useState('');
    const [tipo, setTipo] = useState('');
    const [tags, setTags] = useState('');

    // --- Funções de API ---
    const fetchCartas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/cartas');
            setCartas(response.data);
        } catch (err) {
            console.error('Erro ao buscar cartas:', err);
            setError('Não foi possível carregar as cartas.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Roda o fetchCartas na primeira vez que a tela carrega
    useEffect(() => {
        fetchCartas();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchCartas();
    };

    // --- Funções de Abertura do Modal ---
    const abrirModalCriar = () => {
        setCartaEmEdicao(null);
        // Limpa os campos
        setNome('');
        setDescricao('');
        setImagemUrl('');
        setTipo('');
        setTags('');
        setModalVisivel(true);
    };

    const abrirModalEditar = (carta) => {
        setCartaEmEdicao(carta);
        // Preenche os campos com os dados da carta
        setNome(carta.nome);
        setDescricao(carta.descricao || '');
        setImagemUrl(carta.imagem_url || '');
        setTipo(carta.tipo || '');
        setTags(carta.tags || '');
        setModalVisivel(true);
    };

    // --- Funções de Ação (Submit e Delete) ---
    const handleSalvar = async () => {
        if (!nome || !tipo) {
            Alert.alert('Erro', 'Nome e Tipo são obrigatórios.');
            return;
        }

        // --- ✨ SUA ATUALIZAÇÃO ESTÁ AQUI ---

        // 1. Defina sua URL padrão aqui
        const URL_PADRAO = 'https://i.pinimg.com/736x/78/d9/6a/78d96aee53fbd6b6afba38a029070e25.jpg';
        // 2. Verifica se o campo 'imagemUrl' (do state) está vazio ou só tem espaços
        //    Se estiver vazio, usa a URL_PADRAO. Senão, usa a que o usuário digitou.
        const urlFinal = imagemUrl.trim() ? imagemUrl : URL_PADRAO;

        // --- Fim da Atualização ---

        // 3. Monta o objeto com a 'urlFinal'
        const dadosCarta = { 
            nome, 
            descricao, 
            imagem_url: urlFinal, // 👈 Usamos a urlFinal aqui
            tipo, 
            tags 
        };

        try {
            if (cartaEmEdicao) {
                // ATUALIZAR (PUT)
                await api.put(`/cartas/${cartaEmEdicao.id}`, dadosCarta);
            } else {
                // CRIAR (POST)
                await api.post('/cartas', dadosCarta);
            }
            
            setModalVisivel(false);
            fetchCartas(); // Recarrega a lista
        } catch (err) {
            console.error('Erro ao salvar carta:', err);
            Alert.alert('Erro', 'Não foi possível salvar a carta.');
        }
    };

    const confirmarDelete = (id) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza que deseja deletar esta carta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Deletar', style: 'destructive', onPress: () => handleDeletar(id) }
            ]
        );
    };

    const handleDeletar = async (id) => {
        try {
            await api.delete(`/cartas/${id}`);
            fetchCartas(); // Recarrega a lista
        } catch (err) {
            console.error('Erro ao deletar carta:', err);
            Alert.alert('Erro', 'Não foi possível deletar a carta.');
        }
    };

    // --- Renderização ---
    const renderConteudo = () => {
        if (loading && !refreshing) {
            return <ActivityIndicator size="large" color="#007AFF" style={styles.centered} />;
        }
        if (error) {
            return <Text style={[styles.centered, styles.errorText]}>{error}</Text>;
        }
        return (
            <FlatList
                data={cartas}
                renderItem={({ item }) => (
                    <ItemCartaAdmin 
                        item={item} 
                        onEdit={abrirModalEditar} 
                        onDelete={confirmarDelete}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                ListEmptyComponent={<Text style={styles.centered}>Nenhuma carta cadastrada.</Text>}
            />
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.titulo}>Gerenciar Cartas</Text>
                    <TouchableOpacity style={styles.botaoAdicionar} onPress={abrirModalCriar}>
                        <Text style={styles.botaoAdicionarTexto}>+</Text>
                    </TouchableOpacity>
                </View>

                {renderConteudo()}
            </View>

            {/* --- Modal de Edição/Criação --- */}
            <Modal
                visible={modalVisivel}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setModalVisivel(false)}
            >
                <SafeAreaView style={styles.modalSafeArea}>
                    <ScrollView style={styles.modalContainer}>
                        <Text style={styles.modalTitulo}>
                            {cartaEmEdicao ? 'Editar Carta' : 'Criar Nova Carta'}
                        </Text>
                        
                        <Text style={styles.label}>Nome*</Text>
                        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome da Carta" />
                        
                        <Text style={styles.label}>Tipo*</Text>
                        <TextInput style={styles.input} value={tipo} onChangeText={setTipo} placeholder="Criatura, Magia, etc." />
                        
                        <Text style={styles.label}>URL da Imagem</Text>
                        <TextInput style={styles.input} value={imagemUrl} onChangeText={setImagemUrl} placeholder="https://exemplo.com/imagem.png" />
                        
                        <Text style={styles.label}>Tags</Text>
                        <TextInput style={styles.input} value={tags} onChangeText={setTags} placeholder="ataque,magia,suporte" />
                        
                        <Text style={styles.label}>Descrição</Text>
                        <TextInput style={[styles.input, styles.textarea]} value={descricao} onChangeText={setDescricao} placeholder="Descrição da carta..." multiline />
                        
                        <View style={styles.modalBotoes}>
                            <TouchableOpacity style={[styles.botaoAcao, styles.botaoCancelar]} onPress={() => setModalVisivel(false)}>
                                <Text style={styles.botaoTexto}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.botaoAcao, styles.botaoSalvar]} onPress={handleSalvar}>
                                <Text style={styles.botaoTexto}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

// --- Estilos ---
// Voltando a usar StyleSheet.create
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    titulo: { fontSize: 28, fontWeight: 'bold', color: '#222' },
    botaoAdicionar: { backgroundColor: '#007AFF', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    botaoAdicionarTexto: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    listContainer: { paddingHorizontal: 16, paddingBottom: 16 },
    card: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
    cardInfo: { flex: 1 },
    cardNome: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    cardTipo: { fontSize: 14, color: '#666' },
    cardAcoes: { flexDirection: 'row' },
    botaoAcao: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginLeft: 8 },
    botaoEditar: { backgroundColor: '#ffc107' },
    botaoDeletar: { backgroundColor: '#dc3545' },
    botaoCancelar: { backgroundColor: '#6c757d' },
    botaoSalvar: { backgroundColor: '#28a745' },
    botaoTexto: { color: '#fff', fontWeight: '500' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, textAlign: 'center', marginTop: 50 },
    errorText: { color: 'red', fontSize: 16 },
    // Estilos do Modal
    modalSafeArea: { flex: 1 },
    modalContainer: { padding: 20 },
    modalTitulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 16, fontWeight: '500', color: '#444', marginBottom: 6, marginTop: 10 },
    input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', paddingVertical: 10, paddingHorizontal: 8, fontSize: 16, borderRadius: 4, marginBottom: 10 },
    textarea: { minHeight: 100, textAlignVertical: 'top' },
    modalBotoes: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 }
});

export default GerenciarCartasScreen;