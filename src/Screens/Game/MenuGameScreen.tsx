import GameOptionCard from "../../components/Game/GameOptionCard";

export default function MenuGameScreen() {
    return (
        <GameOptionCard
        title="Juego de Memoria"
        image="https://i.pinimg.com/originals/0f/6e/0f/0f6e0f4b5b5b5b5b5b5b5b5b5b5b5b5.jpg"
        onPress={() => console.log("Juego de Memoria")}/>
    )
}