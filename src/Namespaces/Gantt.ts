// @ts-ignore
namespace Gantt {
    export type Block = {
        uuid: string;
        row: string;
        text?: string;
        overlay?: boolean;
        start: Date;
        end: Date;
    }

    export type Row = {
        uuid: string;
        blocks: Block[];
    }
}
