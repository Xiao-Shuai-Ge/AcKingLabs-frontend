
export const PostTypeToName = (type_code: string): string => {
    switch (type_code) {
        case "diary":
            return "周记";
    }
    return "未知";
}