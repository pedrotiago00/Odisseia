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
    Alert 
} from 'react-native';

// Importe sua API
import api from '../../servicers/api';

// Componente ItemCartaAdmin (sem mudanças)
const ItemCartaAdmin = ({ item, onEdit, onDelete }) => (
    // ... (seu código aqui, sem mudanças)
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
    const [refreshing, setRefreshing] = useState(false);

    // --- Estado do Modal e Formulário ---
    const [modalVisivel, setModalVisivel] = useState(false);
    const [cartaEmEdicao, setCartaEmEdicao] = useState(null); 
    
    // --- NOVO STATE ---
    // 1. Guarda todas as tags disponíveis vindas do BD
    const [todasAsTags, setTodasAsTags] = useState([]);

    // Campos do formulário (sem mudanças)
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imagemUrl, setImagemUrl] = useState('');
    const [tipo, setTipo] = useState('');
    const [tags, setTags] = useState(''); // Continua sendo uma string "tag1,tag2,tag3"

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

    // --- NOVA FUNÇÃO ---
    // 2. Busca todas as tags da API
    const fetchTags = async () => {
        try {
            const response = await api.get('/tags');
            setTodasAsTags(response.data);
        } catch (err) {
            console.error('Erro ao buscar tags:', err);
            Alert.alert('Erro', 'Não foi possível carregar as tags para o formulário.');
        }
    };

    // --- ATUALIZADO ---
    // 3. Roda ambas as buscas quando a tela carrega
    useEffect(() => {
        fetchCartas();
        fetchTags(); // Busca as tags também
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchCartas();
        // Opcional: buscar tags de novo se elas puderem mudar
        // fetchTags(); 
    };

    // --- Funções de Abertura do Modal (sem mudanças) ---
    // Elas já limpam ou preenchem o state 'tags' (string),
    // o que é perfeito para o nosso novo seletor.
    const abrirModalCriar = () => {
        setCartaEmEdicao(null);
        setNome('');
        setDescricao('');
        setImagemUrl('');
        setTipo('');
        setTags(''); // Limpa a string de tags
        setModalVisivel(true);
    };

    const abrirModalEditar = (carta) => {
        setCartaEmEdicao(carta);
        setNome(carta.nome);
        setDescricao(carta.descricao || '');
        setImagemUrl(carta.imagem_url || '');
        setTipo(carta.tipo || '');
        setTags(carta.tags || ''); // Preenche a string de tags (ex: "ataque,suporte")
        setModalVisivel(true);
    };

    // --- Funções de Ação (Submit e Delete) ---

    // --- NOVA FUNÇÃO ---
    // 4. Lógica para adicionar/remover uma tag da string de tags
    const handleToggleTag = (tag) => {
        // Converte a string "tag1,tag2" em um array ["tag1", "tag2"]
        // Filtra tags vazias caso a string seja "" ou "tag1,,tag2"
        const tagsArray = tags ? tags.split(',').filter(Boolean) : [];
        
        let newTagsArray;

        if (tagsArray.includes(tag)) {
            // Se já tem, remove
            newTagsArray = tagsArray.filter(t => t !== tag);
        } else {
            // Se não tem, adiciona
            newTagsArray = [...tagsArray, tag];
        }

        // Converte o array ["tag1", "tag2"] de volta para a string "tag1,tag2"
        setTags(newTagsArray.join(','));
    };

    // handleSalvar (sem NENHUMA mudança)
    // A lógica de salvar já pega o state 'tags', que
    // agora é controlado pelos botões.
    const handleSalvar = async () => {
        if (!nome || !tipo) {
            Alert.alert('Erro', 'Nome e Tipo são obrigatórios.');
            return;
        }

        const URL_PADRAO = 'https://i.pinimg.com/736x/78/d9/6a/78d96aee53fbd6b6afba38a029070e25.jpg';
        const urlFinal = imagemUrl.trim() ? imagemUrl : URL_PADRAO;

        const dadosCarta = { 
            nome, 
            descricao, 
            imagem_url: urlFinal,
            tipo, 
            tags // 👈 Esta string é atualizada pelos botões
        };

        try {
            if (cartaEmEdicao) {
                await api.put(`/cartas/${cartaEmEdicao.id}`, dadosCarta);
            } else {
                await api.post('/cartas', dadosCarta);
            }
            
            setModalVisivel(false);
            fetchCartas(); // Recarrega a lista
        } catch (err) {
            console.error('Erro ao salvar carta:', err);
            Alert.alert('Erro', 'Não foi possível salvar a carta.');
        }
    };

    // Funções de Delete (sem mudanças)
    const confirmarDelete = (id) => {
        // ... (seu código aqui, sem mudanças)
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
        // ... (seu código aqui, sem mudanças)
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
        // ... (seu código aqui, sem mudanças)
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
            {/* Header (sem mudanças) */}
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
                        
                        {/* --- ATUALIZADO --- */}
                        {/* 5. Substituímos o TextInput de Tags por este bloco */}
                        <Text style={styles.label}>Tags</Text>
                        <View style={styles.tagsContainer}>
                            {todasAsTags.map(tagItem => {
                                // Verifica se a tag (ex: "ataque") está na string "ataque,suporte"
                                const isSelected = tags ? tags.split(',').includes(tagItem.tag) : false;
                                
                                return (
                                    <TouchableOpacity
                                        key={tagItem.id}
                                        // Aplica estilo de selecionado
                                        style={[styles.tagBotao, isSelected && styles.tagBotaoSelecionado]}
                                        // Chama a função de toggle
                                        onPress={() => handleToggleTag(tagItem.tag)}
                                    >
                                        <Text style={[styles.tagTexto, isSelected && styles.tagTextoSelecionado]}>
                                            {tagItem.nome}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {/* Fim da atualização */}

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
    modalBotoes: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, marginBottom: 50 },

    // --- NOVOS ESTILOS PARA AS TAGS ---
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 5,
    },
    tagBotao: {
        backgroundColor: '#e0e0e0',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 15,
        margin: 4,
    },
    tagBotaoSelecionado: {
        backgroundColor: '#007AFF',
    },
    tagTexto: {
        color: '#333',
        fontWeight: '500',
    },
    tagTextoSelecionado: {
        color: '#fff',
    }
});

export default GerenciarCartasScreen;