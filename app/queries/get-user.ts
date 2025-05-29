import User from "~/server/models/user";

export async function getUser(sessionId: string) {
  let user = null;

  if (sessionId) {
    const userData = await User.findById(sessionId).lean();
    if (userData) {
      user = {
        ...userData,
        _id: userData._id.toString(),
        savedItems: userData.savedItems.map((item) => ({
          ...item,
          productId: item.productId.toString(),
        })),
      };
    }
  }

  return user;
}
