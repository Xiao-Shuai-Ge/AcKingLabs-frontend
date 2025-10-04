/**
 * 根据用户角色获取内容长度限制
 * @param role 用户角色 (0: 未认证, 1: 普通用户, 2: 正式选手, 3+: 管理员)
 * @returns 返回帖子和评论的最大长度限制
 */
export function getContentLimit(role: number): { maxPostLength: number; maxCommentLength: number } {
  // 管理员 (role >= 3): 50000字帖子，5000字评论
  if (role >= 3) {
    return {
      maxPostLength: 50000,
      maxCommentLength: 5000,
    };
  }
  
  // 正式选手 (role == 2): 30000字帖子，2000字评论
  if (role === 2) {
    return {
      maxPostLength: 30000,
      maxCommentLength: 2000,
    };
  }
  
  // 普通用户 (role < 2): 15000字帖子，1000字评论
  return {
    maxPostLength: 15000,
    maxCommentLength: 1000,
  };
}

