import { WordSearchMatch } from "../models/InterfacesModels";

export interface IWordSearchMatchRepository {
    find(): Promise<WordSearchMatch>;
}