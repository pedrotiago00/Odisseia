import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    FlatList,
    Image,
    StyleSheet,
    ActivityIndicator, 
    TouchableOpacity, 
    Modal, 
    ScrollView,
    ImageBackground 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; 
import api from '../../servicers/api.js';
import useTelaCheia from '../../hooks/TelaCheia.js';



const screenBackground = require('../../assets/Background.jpeg'); 

// --- (Componentes GridCardItem e FiltroCheckbox não mudam) ---

/** Uma única carta no grid (grade) */
const GridCardItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.gridItem} onPress={onPress}>
        <Image
            source={{ uri: item.imagem_url || 'https://placehold.co/100x150/ccc/fff?text=Sem+Img' }}
            style={styles.gridItemImage}
            resizeMode="cover"
        />
    </TouchableOpacity>
);

/** Um item (checkbox) no Modal de Filtro */
const FiltroCheckbox = ({ filtro, selecionado, onPress }) => (
    <TouchableOpacity 
        style={styles.filtroModalItem} 
        onPress={() => onPress(filtro.tag)}
    >
        <View style={styles.checkbox}>
            {selecionado && <View style={styles.checkboxMarcado} />}
        </View>
        <Text style={styles.filtroModalTexto}>{filtro.nome}</Text>
    </TouchableOpacity>
);

// --- Componente Principal da Tela ---
const ListaCartasScreen = ({ navigation }) => {
    // --- (Todos os 'useState' e 'useEffect' continuam os mesmos) ---
    const [cartas, setCartas] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const [selectedCard, setSelectedCard] = useState(null); 
    const [todosOsFiltros, setTodosOsFiltros] = useState([]); 
    const [filtrosAtivos, setFiltrosAtivos] = useState([]); 
    const [loadingFiltros, setLoadingFiltros] = useState(true);
    const [modalFiltroVisivel, setModalFiltroVisivel] = useState(false);

    useTelaCheia();

    useEffect(() => {
        const fetchFiltros = async () => {
            setLoadingFiltros(true);
            try {
                const response = await api.get('/tags'); 
                setTodosOsFiltros(response.data); 
            } catch (err) {
                console.error('Erro ao buscar filtros:', err);
            } finally {
                setLoadingFiltros(false);
            }
        };
        fetchFiltros(); 
    }, []); 

    useEffect(() => {
        const fetchCartas = async () => {
            setLoading(true); 
            setError(null);
            try {
                const params = {};
                if (filtrosAtivos.length > 0) {
                    params.tags = filtrosAtivos.join(','); 
                }
                const response = await api.get('/cartas', { params });
                setCartas(response.data); 
            } catch (err) {
                console.error('Erro ao buscar cartas:', err);
                if (err.response?.status !== 401) {
                   setError('Não foi possível carregar as cartas.');
                }
            } finally {
                setLoading(false); 
            }
        };
        fetchCartas(); 
    }, [filtrosAtivos]); 

    // --- (Funções de handler não mudam) ---
    const handleCardPress = (card) => {
        setSelectedCard(card);
    };
    const handleCloseZoomModal = () => {
        setSelectedCard(null);
    };
    const handleToggleFiltro = (tag) => {
        setFiltrosAtivos(prev => {
            const jaExiste = prev.includes(tag);
            if (jaExiste) {
                return prev.filter(t => t !== tag); 
            } else {
                return [...prev, tag]; 
            }
        });
    };
    const limparFiltros = () => {
        setFiltrosAtivos([]);
        setModalFiltroVisivel(false);
    };
    const renderConteudo = () => {
        // ... (código do renderConteudo não muda)
        if (loading) {
            return <ActivityIndicator size="large" color="#FFF" style={styles.centered} />;
        }
        if (error) {
            return <Text style={[styles.centered, styles.errorText]}>{error}</Text>;
        }
        if (cartas.length === 0) {
            return <Text style={[styles.centered, styles.textoBranco]}>Nenhuma carta encontrada.</Text>;
        }
        return (
            <FlatList
                data={cartas}
                renderItem={({ item }) => (
                    <GridCardItem 
                        item={item} 
                        onPress={() => handleCardPress(item)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={4} 
                key={4} 
                contentContainerStyle={styles.listContainer}
            />
        );
    };


    // --- Renderização Principal (JSX) ---
    return (
        // 1. Usamos um Fragmento <> para "agrupar" a tela e os modais
        <>
            {/* FUNDO DA TELA INTEIRA */}
            <ImageBackground source={screenBackground} style={styles.screenBackground}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.container}>
                        
                        {/* Header (TÍTULO + BOTÃO VOLTAR) */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.titulo}>Coleção</Text>
                            <TouchableOpacity 
                                style={styles.backButton} 
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.backButtonText}>Voltar</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Botão de Filtro */}
                        <TouchableOpacity 
                            style={styles.filtroBotaoPrincipal} 
                            onPress={() => setModalFiltroVisivel(true)}
                        >
                            <Text style={styles.filtroBotaoTexto}>
                                Filtrar ({filtrosAtivos.length > 0 ? `${filtrosAtivos.length} aplicados` : "Todos"})
                            </Text>
                        </TouchableOpacity>

                        {/* Grid de Cartas */}
                        {renderConteudo()}
                    </View>
                </SafeAreaView>
            </ImageBackground>

            {/* --- Seção 3: Modal de ZOOM (MOVEMOS PARA FORA) --- */}
            {selectedCard && (
                <Modal
                    animationType="fade"
                    transparent={true} 
                    visible={!!selectedCard} 
                    onRequestClose={handleCloseZoomModal}
                    statusBarTranslucent={true} // <-- ADICIONADO AQUI
                >
                    <TouchableOpacity 
                        style={styles.modalOverlay} 
                        activeOpacity={1} 
                        onPress={handleCloseZoomModal} 
                    >
                        <View onStartShouldSetResponder={() => true}>
                            <View style={styles.zoomImageContainer}>
                                <ImageBackground
                                    source={{ uri: selectedCard.imagem_url || 'https://placehold.co/300x450/ccc/fff?text=Sem+Img' }}
                                    style={styles.zoomImage}
                                    resizeMode="contain"
                                >
                                    <LinearGradient
                                        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.8)', 'transparent']}
                                        style={styles.textOverlay}
                                    >
                                        <Text style={styles.modalNome}>{selectedCard.nome}</Text>
                                        <Text style={styles.modalTipo}>{selectedCard.tipo}</Text>
                                        <Text style={styles.modalTags}>Tags: {selectedCard.tags}</Text>
                                    </LinearGradient>
                                </ImageBackground>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}

            {/* --- Seção 4: Modal de FILTROS (MOVEMOS PARA FORA) --- */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalFiltroVisivel}
                onRequestClose={() => setModalFiltroVisivel(false)}
                statusBarTranslucent={true} // <-- ADICIONADO AQUI
            >
                <TouchableOpacity 
                    style={styles.filtroModalContainer}
                    activeOpacity={1}
                    onPressOut={() => setModalFiltroVisivel(false)} 
                >
                    <View 
                        style={styles.filtroModalContent}
                        onStartShouldSetResponder={() => true}
                    >
                        <Text style={styles.filtroModalTitulo}>Filtrar</Text>
                        
                        {loadingFiltros ? (
                            <ActivityIndicator size="small" />
                        ) : (
                            <ScrollView style={styles.filtroModalScroll}>
                                {todosOsFiltros.map(filtro => (
                                    <FiltroCheckbox
                                        key={filtro.tag}
                                        filtro={filtro}
                                        selecionado={filtrosAtivos.includes(filtro.tag)}
                                        onPress={handleToggleFiltro}
                                    />
                                ))}
                            </ScrollView>
                        )}
                        
                        <View style={styles.filtroModalBotoes}>
                            <TouchableOpacity 
                                style={[styles.filtroModalBotao, styles.botaoLimpar]} 
                                onPress={limparFiltros}
                            >
                                <Text style={[styles.filtroModalBotaoTexto, styles.textoLimpar]}>Limpar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.filtroModalBotao, styles.botaoAplicar]} 
                                onPress={() => setModalFiltroVisivel(false)}
                            >
                                <Text style={styles.filtroModalBotaoTexto}>Aplicar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
        </> // 2. Fechamos o Fragmento
    );
};

// --- Estilos ---
const styles = StyleSheet.create({
    screenBackground: {
        flex: 1,
    },
    safeArea: { 
        flex: 1, 
        
        backgroundColor: 'transparent' 
    },
    container: { flex: 1, paddingHorizontal: 16 },

    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    titulo: { 
        fontSize: 48, 
        fontWeight: 'bold', 
        color: '#FFFFFF', 
        flex: 1, 
        textShadowColor: 'rgba(0, 0, 0, 0.75)', 
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 3
    },
    backButton: {
        backgroundColor: '#f0f0f0', 
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        opacity: 0.9, 
    },
    backButtonText: {
        color: '#333',
        fontWeight: '500',
        fontSize: 16,
    },
    
    filtroBotaoPrincipal: {
        backgroundColor: '#007AFF',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 16,
        opacity: 0.9,
    },
    filtroBotaoTexto: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    listContainer: { paddingBottom: 16 },
    
    // (Mantido)
    gridItem: {
        flex: 1/4, 
        aspectRatio: 0.7, 
        padding: 4, 
        backgroundColor: 'transparent',
    },
    gridItemImage: {
        width: '100%',
        height: '100%',
        borderRadius: 8, 
    },

    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, textAlign: 'center' },
    errorText: { color: 'red', fontSize: 16 },
    textoBranco: { color: 'white', fontSize: 16 }, 

    // Estilos do MODAL DE ZOOM (Mantido)
    modalOverlay: {
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.85)', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomImageContainer: {
        width: '100%', // (Mantido 100%)
        aspectRatio: 0.7, 
        borderRadius: 16, 
        overflow: 'hidden', 
        backgroundColor: '#ffe2b4ff', 
    },
    zoomImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start', 
    },
    textOverlay: {
        paddingTop: 1, 
        paddingHorizontal: 16,
        paddingBottom: 32, 
    },
    modalNome: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#FFF', 
        textAlign: 'left',
    },
    modalTipo: { 
        fontSize: 16, 
        fontStyle: 'italic', 
        color: '#CCC', 
        textAlign: 'left', 
        marginTop: 4 
    },
    modalTags: { 
        fontSize: 14, 
        color: '#00AFFF', 
        fontWeight: '600', 
        textAlign: 'left', 
        marginTop: 8 
    },

    // --- Estilos do MODAL DE FILTRO (Mantido) ---
    filtroModalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    filtroModalContent: {
        backgroundColor: '#404040', 
        maxHeight: '70%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 24,
    },
    filtroModalTitulo: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#FFFFFF', 
    },
    filtroModalScroll: {
        maxHeight: 300, 
    },
    filtroModalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#555', 
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#007AFF',
        borderRadius: 4,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxMarcado: {
        width: 16,
        height: 16,
        backgroundColor: '#007AFF',
        borderRadius: 2,
    },
    filtroModalTexto: {
        fontSize: 18,
        color: '#FFFFFF', 
    },
    filtroModalBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    filtroModalBotao: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    botaoLimpar: {
        backgroundColor: '#f0f0f0',
        marginRight: 8,
    },
    botaoAplicar: {
        backgroundColor: '#007AFF',
        marginLeft: 8,
    },
    filtroModalBotaoTexto: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    textoLimpar: {
        color: '#555',
    }
});

export default ListaCartasScreen;