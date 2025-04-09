

export const getWeekday = (dataString: string) => {
    const date = new Date(dataString);
    return ['7', '1', '2', '3', '4', '5', '6'][date.getDay()];
};