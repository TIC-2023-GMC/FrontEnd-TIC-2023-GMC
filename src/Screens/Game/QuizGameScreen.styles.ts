import { StyleSheet } from "react-native";

export const customFonts = {
    Ranchers: require('../../assets/fonts/Ranchers-Regular.ttf'),
  };
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        flexDirection: "column",
        fontFamily: 'Ranchers',
    },
    timeStyle: {
        fontSize: 16,
        fontWeight: 'bold', 
        fontFamily: 'Ranchers',
        margin: 10
    },
    cardContainer: {
        width: 325,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },
    gameDescription: {
        fontSize: 20,
        fontWeight: 'bold', 
        fontFamily: 'Ranchers',
        marginBottom: 20
    },
    questionStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    buttonAnswer: {
        width: 'auto',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        textAlign: 'center',
        paddingHorizontal: 20
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18,
        paddingVertical: 2,
        paddingHorizontal: 2
    },
    match: {
        backgroundColor: '#EDE4AB',
        width: '88%',
        height: '23%',
        borderRadius: 10,
        marginBottom: 20,
        alignSelf: 'center'
    },

    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#534F6E'
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    leaderboard: {
        backgroundColor: '#B2AAED',
        width: '88%',
        height: '50%',
        borderRadius: 10,
        marginBottom: 20,
        alignSelf: 'center'
    },
    leaderboardTextitle: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'sans-serif'
    },
    leaderboardHeader: {
        backgroundColor: '#EDE4AB',
        paddingHorizontal: 5,
        textAlign: 'center',
        fontFamily: 'sans-serif',
        fontSize: 17,
        color: '#000000',
        width: '35%'
    },
    leaderboardText: {
        paddingHorizontal: 20,
        fontFamily: 'sans-serif',
        fontSize: 17,
        color: '#534F6E',
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginRight: 15,
        borderRadius: 5
    },
    acceptButton: {
        width: '88%',
        alignSelf: 'center'
    }

});