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

import api from '../../servicers/api';

// --- Componente de Item da Lista (Admin) ---
// Apenas exibe a carta e os botões de "Editar" e "Deletar"
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

// --- Tela Principal ---
const GerenciarCartasScreen = () => {
    // --- Estados da Tela ---
    const [cartas, setCartas] = useState([]); // Lista de cartas
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // --- Estado do Modal e Formulário ---
    const [modalVisivel, setModalVisivel] = useState(false);
    // Guarda a carta original ao editar (ou null se for 'Criar')
    const [cartaEmEdicao, setCartaEmEdicao] = useState(null);
    
    // --- NOVO STATE ---
    // Guarda todas as tags *disponíveis* vindas do BD (ex: [{id: 1, nome: "Fogo", tag: "fogo"}, ...])
    const [todasAsTags, setTodasAsTags] = useState([]);

    // --- Estados dos campos do formulário ---
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [imagemUrl, setImagemUrl] = useState('');
    const [tipo, setTipo] = useState('');
    // Este state continua sendo uma string (ex: "fogo,agua,suporte")
    const [tags, setTags] = useState('');

    // --- Funções de API ---
    /** Busca a lista de cartas da API */
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
    /** 2. Busca todas as tags *disponíveis* da API (rota /tags) */
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
    /** 3. Roda ambas as buscas quando a tela carrega */
    useEffect(() => {
        fetchCartas();
        fetchTags(); // Busca as tags também
    }, []);

    /** Recarrega a lista ao "puxar para baixo" */
    const handleRefresh = () => {
        setRefreshing(true);
        fetchCartas();
        // Opcional: buscar tags de novo se elas puderem mudar
        // fetchTags(); 
    };

    // --- Funções de Abertura do Modal ---
    
    /** Abre o modal para CRIAR uma nova carta */
    const abrirModalCriar = () => {
        setCartaEmEdicao(null); // Define o modo como "Criar"
        // Limpa todos os campos
        setNome('');
        setDescricao('');
        setImagemUrl('');
        setTipo('');
        setTags(''); // Limpa a string de tags selecionadas
        setModalVisivel(true);
    };

    /** Abre o modal para EDITAR uma carta existente */
    const abrirModalEditar = (carta) => {
        setCartaEmEdicao(carta); // Define o modo como "Editar"
        // Preenche os campos com os dados da carta
        setNome(carta.nome);
        setDescricao(carta.descricao || '');
        setImagemUrl(carta.imagem_url || '');
        setTipo(carta.tipo || '');
        setTags(carta.tags || ''); // Preenche a string de tags (ex: "ataque,suporte")
        setModalVisivel(true);
    };

    // --- Funções de Ação (Submit e Delete) ---

    // --- NOVA FUNÇÃO ---
    /** 4. Lógica para adicionar/remover uma tag da string 'tags' */
    const handleToggleTag = (tag) => { // ex: tag = "fogo"
        // Converte a string "fogo,agua" em um array ["fogo", "agua"]
        // Filtra tags vazias caso a string seja ""
        const tagsArray = tags ? tags.split(',').filter(Boolean) : [];
        
        let newTagsArray;

        if (tagsArray.includes(tag)) {
            // Se já tem, remove (filtra)
            newTagsArray = tagsArray.filter(t => t !== tag);
        } else {
            // Se não tem, adiciona
            newTagsArray = [...tagsArray, tag];
        }

        // Converte o array ["fogo", "agua"] de volta para a string "fogo,agua"
        setTags(newTagsArray.join(','));
    };

    /** Salva a carta (seja Criar ou Editar) */
    // NOTA: Esta função NÃO PRECISA MUDAR. Ela já pega o state 'tags' (string),
    // que agora é controlado pelos botões de toggle.
    const handleSalvar = async () => {
        if (!nome || !tipo) {
            Alert.alert('Erro', 'Nome e Tipo são obrigatórios.');
            return;
        }

        // Define uma URL padrão se o campo estiver vazio
        const URL_PADRAO = 'https://i.pinimg.com/736x/78/d9/6a/78d96aee53fbd6b6afba38a029070e25.jpg';
        const urlFinal = imagemUrl.trim() ? imagemUrl : URL_PADRAO;

        // Monta o objeto de dados para enviar
        const dadosCarta = { 
            nome, 
            descricao, 
            imagem_url: urlFinal,
            tipo, 
            tags // 👈 Esta é a string "fogo,agua" atualizada pelo 'handleToggleTag'
        };

        try {
            if (cartaEmEdicao) {
                // Modo Edição: usa PUT
                await api.put(`/cartas/${cartaEmEdicao.id}`, dadosCarta);
            } else {
                // Modo Criação: usa POST
                await api.post('/cartas', dadosCarta);
            }
            
            setModalVisivel(false);
            fetchCartas(); // Recarrega a lista
        } catch (err) {
            console.error('Erro ao salvar carta:', err);
            Alert.alert('Erro', 'Não foi possível salvar a carta.');
        }
    };

    /** Pede confirmação antes de deletar */
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

    /** Deleta a carta da API */
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
    /** Renderiza o conteúdo principal (Loading, Erro ou Lista) */
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
            {/* Header */}
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.titulo}>Gerenciar Cartas</Text>
                    {/* Botão "+" para abrir o modal de Criar */}
                    <TouchableOpacity style={styles.botaoAdicionar} onPress={abrirModalCriar}>
                        <Text style={styles.botaoAdicionarTexto}>+</Text>
                    </TouchableOpacity>
                </View>
                {/* Lista de cartas */}
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
                        
                        {/* Campos de Texto */}
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
                            {/* Mapeia o array 'todasAsTags' (vindas da API) */}
                            {todasAsTags.map(tagItem => {
                                // Verifica se a tag (ex: "fogo") está na string "fogo,agua"
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
                        
                        {/* Botões de Ação do Modal */}
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
        flexWrap: 'wrap', // Permite que as tags quebrem a linha
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
        backgroundColor: '#007AFF', // Cor de destaque
    },
    tagTexto: {
        color: '#333',
        fontWeight: '500',
    },
    tagTextoSelecionado: {
        color: '#fff', // Texto branco quando selecionado
    }
});

export default GerenciarCartasScreen;