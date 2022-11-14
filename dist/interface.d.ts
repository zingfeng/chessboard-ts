export interface ChessBoardConfig {
    selector: string;
    config: {
        position?: string;
        draggable?: boolean;
        dropOffBoard?: "snapback" | "trash";
        sparePieces?: boolean;
    };
}
