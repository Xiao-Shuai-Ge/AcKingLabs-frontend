

const LevelLowerLimit : {[key: number]: [number, number]} = {
    0 : [0,0], // 未实名游客 (gray)
    1 : [0,1], // 绿名 (green)
    2 : [40,1], // 青名 (cyan)
    3 : [100,1], // 蓝名 (blue)
    4 : [200,1], // 紫名 (purple)
    5 : [200,2], // 黄名-正式成员 (yellow)
    6 : [400,2], // 橙名 (orange)
    7 : [400,3], // 红名-管理员 (red)
    8 : [400,-1], // 结尾，用于判断
}

const LevelCnt = 7;

export const CheckLevel = (xp : number, role : number) => {
    let i=0;
    for (i = 0 ; i <= LevelCnt ; i++) {
        if (xp < LevelLowerLimit[i][0] || role < LevelLowerLimit[i][1]) {
            break;
        }
    }
    return i-1;
}

export const NextLevelLimit = (xp : number, role : number) => {
    let i=0;
    for (i = 0 ; i <= LevelCnt ; i++) {
        if (xp < LevelLowerLimit[i][0] || role < LevelLowerLimit[i][1]) {
            break;
        }
    }
    return LevelLowerLimit[i][0];
}

export const GetBgColor = (level : number) => {
    switch (level) {
        case 0:
            return "bg-gray-500";
        case 1:
            return "bg-green-400";
        case 2:
            return "bg-cyan-500";
        case 3:
            return "bg-blue-700";
        case 4:
            return "bg-purple-700";
        case 5:
            return "bg-yellow-400";
        case 6:
            return "bg-orange-400";
        case 7:
            return "bg-red-500";
        default:
            return "bg-gray-500";
    }
}

export const GetTextColor = (level : number) => {
    switch (level) {
        case 0:
            return "text-gray-500";
        case 1:
            return "text-green-400";
        case 2:
            return "text-cyan-500";
        case 3:
            return "text-blue-700";
        case 4:
            return "text-purple-700";
        case 5:
            return "text-yellow-400";
        case 6:
            return "text-orange-400";
        case 7:
            return "text-red-500";
        default:
            return "text-gray-500";
    }
}