// Хранилище для работы с комментариями
import create from "zustand";

const CommentStore = create((set) => ({
    comments: [],

    addComment: (comment) => set((state) => ({comments: [...state.comments, comment]})),

    removeComment: (commentId) => set((state) => ({
        comments: state.comments.filter((comment) => comment.id !== commentId),
    })),

    setComments: (comments) => set(() => ({comments})),
}));