import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator, // "Rodinha" de loading
    TouchableOpacity, // Botão clicável
    Modal, // Pop-up
    Button
} from 'react-native';
// 1. Importe o seu arquivo de configuração do axios
import api from '../../servicers/api.js';

// --- Componentes de Apresentação Locais ---

/** Um único botão de filtro (ex: "Todos", "Fogo", "Água") */
const FiltroItem = ({ filtro, selecionado, onPress }) => (
    <TouchableOpacity
        // Aplica o estilo 'selecionado' condicionalmente
        style={[styles.filtroBotao, selecionado && styles.filtroBotaoSelecionado]}
        onPress={() => onPress(filtro.tag)} // Chama a função com a 'tag' (ex: 'all', 'fire')
    >
        <Text style={[styles.filtroTexto, selecionado && styles.filtroTextoSelecionado]}>
            {filtro.nome} {/* Ex: "Todos" */}
        </Text>
    </TouchableOpacity>
);

/** Uma única carta no grid (grade) */
const GridCardItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.gridItem} onPress={onPress}>
        <Image
            // Se não tiver imagem_url, usa um placeholder
            source={{ uri: item.imagem_url || 'https://placehold.co/100x150/ccc/fff?text=Sem+Img' }}
            style={styles.gridItemImage}
            resizeMode="cover"
        />
    </TouchableOpacity>
);

// --- Componente Principal da Tela ---
const ListaCartasScreen = () => {
    // --- Estados ---
    const [cartas, setCartas] = useState([]); // Array de cartas vindo da API
    const [filtroAtivo, setFiltroAtivo] = useState('all'); // Filtro selecionado (inicia com 'all')
    const [loading, setLoading] = useState(true); // Controla o loading das CARTAS
    const [error, setError] = useState(null); // Mensagem de erro
    const [selectedCard, setSelectedCard] = useState(null); // Carta selecionada para o modal

    // States para os filtros que vêm da API
    const [filtros, setFiltros] = useState([]); // Array de filtros (tags)
    const [loadingFiltros, setLoadingFiltros] = useState(true); // Controla o loading dos FILTROS

    /**
     * Efeito 1: Busca os FILTROS (TAGS) da API.
     * Roda apenas UMA VEZ quando a tela é carregada (note o `[]` no final).
     */
    useEffect(() => {
        const fetchFiltros = async () => {
            setLoadingFiltros(true);
            try {
                const response = await api.get('/tags'); // 1. Busca na rota /tags
                
                // 2. Adiciona manualmente o filtro "Todos" no início da lista
                const filtroTodos = { id: 0, nome: 'Todos', tag: 'all' };
                
                // 3. Salva no state: [Todos, ...filtrosDaApi]
                setFiltros([filtroTodos, ...response.data]);

            } catch (err) {
                console.error('Erro ao buscar filtros:', err);
                // Se falhar, pelo menos o "Todos" aparece
                setFiltros([{ id: 0, nome: 'Todos', tag: 'all' }]);
            } finally {
                setLoadingFiltros(false);
            }
        };

        fetchFiltros(); // Executa a função
    }, []); // `[]` = Roda só uma vez

    /**
     * Efeito 2: Busca as CARTAS da API.
     * Roda toda vez que o `filtroAtivo` mudar.
     */
    useEffect(() => {
        const fetchCartas = async () => {
            setLoading(true); // Começa o loading
            setError(null);
            
            try {
                // Prepara os parâmetros da requisição
                const params = {};
                if (filtroAtivo !== 'all') {
                    params.tag = filtroAtivo; // Ex: { tag: 'fire' }
                }
                
                // Busca na rota /cartas, passando os params
                // Se filtroAtivo for 'all', params será {} e a API trará tudo
                const response = await api.get('/cartas', { params });
                setCartas(response.data); // Salva as cartas no state

            } catch (err) {
                console.error('Erro ao buscar cartas:', err);
                // Ignora o erro 401 (sessão expirada) que o 'api.js' já trata
                if (err.response?.status !== 401) {
                   setError('Não foi possível carregar as cartas.');
                }
            } finally {
                setLoading(false); // Termina o loading
            }
        };

        fetchCartas(); // Executa a função
    }, [filtroAtivo]); // `[filtroAtivo]` = Roda de novo sempre que 'filtroAtivo' mudar

    // --- Funções do Modal de Detalhes ---
    const handleCardPress = (card) => {
        setSelectedCard(card); // Salva a carta clicada no state
    };

    const handleCloseModal = () => {
        setSelectedCard(null); // Limpa o state, fechando o modal
    };

    /**
     * Função auxiliar para renderizar o conteúdo principal
     * (Loading, Erro, Lista Vazia ou a Grade de Cartas)
     */
    const renderConteudo = () => {
        // 1. Se estiver carregando
        if (loading) {
            return <ActivityIndicator size="large" color="#007AFF" style={styles.centered} />;
        }
        // 2. Se deu erro
        if (error) {
            return <Text style={[styles.centered, styles.errorText]}>{error}</Text>;
        }
        // 3. Se não tem cartas
        if (cartas.length === 0) {
            return <Text style={styles.centered}>Nenhuma carta encontrada.</Text>;
        }
        // 4. Se tudo deu certo
        return (
            <FlatList
                data={cartas}
                renderItem={({ item }) => (
                    <GridCardItem 
                        item={item} 
                        onPress={() => handleCardPress(item)} // Abre o modal ao clicar
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={4} // Define a grade com 4 colunas
                key={4} // Força a re-renderização se o numColumns mudar
                contentContainerStyle={styles.listContainer}
            />
        );
    };

    // --- Renderização Principal (JSX) ---
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.titulo}>Coleção de Cartas</Text>

                {/* Seção 1: Lista de Filtros */}
                <View style={styles.filtroContainer}>
                    {loadingFiltros ? (
                        // Mostra loading SÓ para os filtros
                        <ActivityIndicator size="small" color="#007AFF" />
                    ) : (
                        // Renderiza a lista horizontal de filtros
                        <FlatList
                            data={filtros} // Usa o state 'filtros'
                            renderItem={({ item }) => (
                                <FiltroItem
                                    filtro={item}
                                    selecionado={filtroAtivo === item.tag} // Destaca o ativo
                                    onPress={setFiltroAtivo} // Clicar muda o 'filtroAtivo'
                                />
                            )}
                            keyExtractor={(item) => item.tag} // Usa a 'tag' como ID
                            horizontal // Lista horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    )}
                </View>

                {/* Seção 2: Conteúdo Principal (Grid de Cartas) */}
                {renderConteudo()}
            </View>

            {/* Seção 3: Modal de Detalhes (só aparece se 'selectedCard' não for null) */}
            {selectedCard && (
                <Modal
                    animationType="fade"
                    transparent={true} // Fundo transparente
                    visible={!!selectedCard} // Converte 'selectedCard' para booleano
                    onRequestClose={handleCloseModal} // Botão "voltar" do Android
                >
                    {/* Overlay escuro clicável para fechar */}
                    <TouchableOpacity 
                        style={styles.modalOverlay} 
                        activeOpacity={1} 
                        onPressOut={handleCloseModal} // Clicar fora do conteúdo fecha
                    >
                        {/* Conteúdo branco (impede o clique de "vazar" para o overlay) */}
                        <View style={styles.modalContent} onStartShouldSetResponder={() => true}> 
                            <Image
                                source={{ uri: selectedCard.imagem_url || 'https://placehold.co/300x450/ccc/fff?text=Sem+Img' }}
                                style={styles.modalImage}
                                resizeMode="contain"
                            />
                            {/* Detalhes da carta */}
                            <Text style={styles.modalNome}>{selectedCard.nome}</Text>
                            <Text style={styles.modalTipo}>{selectedCard.tipo}</Text>
                            <Text style={styles.modalDescricao}>{selectedCard.descricao}</Text>
                            <Text style={styles.modalTags}>Tags: {selectedCard.tags}</Text>
                            
                            <View style={styles.buttonContainer}>
                                <Button title="Fechar" onPress={handleCloseModal} color="#007AFF" />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </SafeAreaView>
    );
};

// --- Estilos ---
// (Os estilos são os mesmos do arquivo, não vou comentar linha por linha
// pois são autoexplicativos e não foram o foco da mudança)
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
    container: { flex: 1, paddingHorizontal: 16 },
    titulo: { fontSize: 28, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#222' },
    filtroContainer: { marginBottom: 16, height: 36 },
    filtroBotao: { backgroundColor: '#e0e0e0', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, marginRight: 8, height: 36 },
    filtroBotaoSelecionado: { backgroundColor: '#007AFF' },
    filtroTexto: { color: '#333', fontWeight: '500' },
    filtroTextoSelecionado: { color: '#fff' },
    listContainer: { paddingBottom: 16 },
    gridItem: {
        flex: 1 / 4, 
        aspectRatio: 0.7, 
        margin: 4,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#eee',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    gridItemImage: {
        width: '100%',
        height: '100%',
    },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, textAlign: 'center' },
    errorText: { color: 'red', fontSize: 16 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '100%',
        maxWidth: 400, 
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
    },
    modalImage: {
        width: '80%',
        aspectRatio: 0.7, 
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    modalNome: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 4 },
    modalTipo: { fontSize: 16, fontStyle: 'italic', color: '#666', marginTop: 4, textAlign: 'center', marginBottom: 12 },
    modalDescricao: { fontSize: 16, color: '#444', marginTop: 8, textAlign: 'center' },
    modalTags: { fontSize: 14, color: '#007AFF', marginTop: 12, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
    buttonContainer: {
        width: '100%',
        marginTop: 10,
    }
});

export default ListaCartasScreen;