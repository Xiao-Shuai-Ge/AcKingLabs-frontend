
export const PostTypeToName = (type_code: string): string => {
    switch (type_code) {
        case "diary":
            return "周记";
        case "tutorial":
            return "教程";
        case "solution":
            return "题解";
        case "contest":
            return "比赛";
        case "fun":
            return "闲聊";
    }
    return "未知";
}

export const PostTypeToColor = (type_code: string): string => {
    switch (type_code) {
        case "diary":
            return "text-gray-500 border-gray-500";
        case "tutorial":
            return "text-purple-500 border-purple-500";
        case "solution":
            return "text-yellow-300 border-yellow-300";
        case "contest":
            return "text-red-300 border-red-300";
        case "fun":
            return "text-blue-300 border-blue-300";
    }
    return "未知";
}