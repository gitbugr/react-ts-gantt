/*
 * finds value or index from array of objects with matching uuid
 * @param {any} array
 * @param {string} uuid
 * @param {boolean} getIndex
 * @returns {any}
 */
export function findByUuid(array:any[] = [], uuid: string, getIndex: boolean = false): any
{
    const objIndex = array.findIndex((obj: any) => obj.uuid === uuid);
    if (objIndex !== -1) {
        let returnValue = objIndex;
        if (!getIndex) {
            returnValue = array[objIndex];
        }
        return returnValue;
    } else {
        throw new Error();
    }
}
