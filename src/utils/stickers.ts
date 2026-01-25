export interface StickerGroup {
  name: string;
  icon?: string; // Optional icon for the category tab
  list: string[];
}

const defaultStickers = [
  'https://xsg-bucket.oss-cn-shenzhen.aliyuncs.com/8dfc3ca5325929032b081789b77ec47cbababa7c1db9933d88066c52f2fcb52c.png',
  'https://xsg-bucket.oss-cn-shenzhen.aliyuncs.com/acf0d7775357fb896312d1733501c4c89e3d329d2546f89a0e52a8fa351d1154.png',
  'https://xsg-bucket.oss-cn-shenzhen.aliyuncs.com/30d392f550180b2d47d7535fbcaf5bd074a31fba2bd50f8e106db8726e119b67.png',
  'https://xsg-bucket.oss-cn-shenzhen.aliyuncs.com/07eef3694ec8423f7fcb228cc16c86ed72eabdc7a7f7e7702dbfb38e84bfdb72.png',
  'https://xsg-bucket.oss-cn-shenzhen.aliyuncs.com/6c986b5747d41c4e277c71a85e9d41c61bf720106d51df3ab459046618ec38f3.png',
  'https://xsg-bucket.oss-cn-shenzhen.aliyuncs.com/4ef7fc1b71153da95c9a28a718c066e972056301f90bac8a0bc5eec50d83048f.png',
  'https://xsg-bucket.oss-cn-shenzhen.aliyuncs.com/gif/1.gif',
  'https://xsg-bucket.oss-cn-shenzhen.aliyuncs.com/gif/2.gif',
  'https://xsg-bucket.oss-cn-shenzhen.aliyuncs.com/gif/3.gif',
  'https://xsg-bucket.oss-cn-shenzhen.aliyuncs.com/gif/4.gif',
  'https://xsg-bucket.oss-cn-shenzhen.aliyuncs.com/gif/6.gif'
];


export const stickerCategories: StickerGroup[] = [
  {
    name: '表情包',
    list: defaultStickers
  }
];

// Keep backward compatibility if needed, or just export the first list
export const stickerList = defaultStickers;
