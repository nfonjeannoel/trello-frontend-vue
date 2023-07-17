import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useBoardsStore = defineStore('boards', () => {
    const boards = ref({})

    return { boards }

})

