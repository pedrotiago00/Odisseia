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
    Button
} from 'react-native';
// 1. Importe o seu arquivo api.js
import api from '../../servicers/api.js';

// ❌ A importação do 'tags.js' FOI REMOVIDA

// Componente para renderizar cada item do filtro (igual ao anterior)
const FiltroItem = ({ filtro, selecionado, onPress }) => (
    <TouchableOpacity
        style={[styles.filtroBotao, selecionado && styles.filtroBotaoSelecionado]}
        onPress={() => onPress(filtro.tag)}
    >
        <Text style={[styles.filtroTexto, selecionado && styles.filtroTextoSelecionado]}>
            {filtro.nome}
        </Text>
    </TouchableOpacity>
);

// Componente GridCardItem (igual ao anterior)
const GridCardItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.gridItem} onPress={onPress}>
        <Image
            source={{ uri: item.imagem_url || 'https://placehold.co/100x150/ccc/fff?text=Sem+Img' }}
            style={styles.gridItemImage}
            resizeMode="cover"
        />
    </TouchableOpacity>
);

const ListaCartasScreen = () => {
    const [cartas, setCartas] = useState([]);
    const [filtroAtivo, setFiltroAtivo] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);

    // --- MUDANÇAS AQUI ---
    // 1. States para os filtros que vêm da API
    const [filtros, setFiltros] = useState([]);
    const [loadingFiltros, setLoadingFiltros] = useState(true);

    // 2. Novo useEffect para BUSCAR OS FILTROS (TAGS)
    useEffect(() => {
        const fetchFiltros = async () => {
            setLoadingFiltros(true);
            try {
                const response = await api.get('/tags'); // Busca na nova rota
                
                // Adiciona o filtro "Todos" manualmente no início da lista
                const filtroTodos = { id: 0, nome: 'Todos', tag: 'all' };
                
                setFiltros([filtroTodos, ...response.data]);

            } catch (err) {
                console.error('Erro ao buscar filtros:', err);
                // Se falhar, pelo menos o "Todos" aparece
                setFiltros([{ id: 0, nome: 'Todos', tag: 'all' }]);
            } finally {
                setLoadingFiltros(false);
            }
        };

        fetchFiltros();
    }, []); // Roda só uma vez quando a tela é carregada

    // useEffect para buscar AS CARTAS (este você já tinha)
    useEffect(() => {
        const fetchCartas = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const params = {};
                if (filtroAtivo !== 'all') {
                    params.tag = filtroAtivo;
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
    }, [filtroAtivo]); 

    // Funções do Modal (sem mudança)
    const handleCardPress = (card) => {
        setSelectedCard(card);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
    };

    // renderConteudo (sem mudança)
    const renderConteudo = () => {
        if (loading) {
            return <ActivityIndicator size="large" color="#007AFF" style={styles.centered} />;
        }
        if (error) {
            return <Text style={[styles.centered, styles.errorText]}>{error}</Text>;
        }
        if (cartas.length === 0) {
            return <Text style={styles.centered}>Nenhuma carta encontrada.</Text>;
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.titulo}>Coleção de Cartas</Text>

                {/* --- MUDANÇAS AQUI --- */}
                {/* 3. FlatList de filtros atualizada */}
                <View style={styles.filtroContainer}>
                    {loadingFiltros ? (
                        <ActivityIndicator size="small" color="#007AFF" />
                    ) : (
                        <FlatList
                            data={filtros} // Usa o state 'filtros'
                            renderItem={({ item }) => (
                                <FiltroItem
                                    filtro={item}
                                    selecionado={filtroAtivo === item.tag}
                                    onPress={setFiltroAtivo}
                                />
                            )}
                            keyExtractor={(item) => item.tag} // Usa a tag como key
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    )}
                </View>

                {renderConteudo()}
            </View>

            {/* Modal (sem mudança) */}
            {selectedCard && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={!!selectedCard}
                    onRequestClose={handleCloseModal}
                >
                    <TouchableOpacity 
                        style={styles.modalOverlay} 
                        activeOpacity={1} 
                        onPressOut={handleCloseModal}
                    >
                        <View style={styles.modalContent} onStartShouldSetResponder={() => true}> 
                            <Image
                                source={{ uri: selectedCard.imagem_url || 'https://placehold.co/300x450/ccc/fff?text=Sem+Img' }}
                                style={styles.modalImage}
                                resizeMode="contain"
                            />
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

// Estilos (sem mudança)
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
    container: { flex: 1, paddingHorizontal: 16 },
    titulo: { fontSize: 28, fontWeight: 'bold', marginTop: 16, marginBottom: 8, color: '#222' },
    filtroContainer: { marginBottom: 16, height: 36 }, // Adicionei uma altura fixa para evitar "pulo"
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