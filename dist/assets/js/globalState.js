const { defineStore } = Pinia;

// 定义 Pinia store
export const useGlobalStateStore = defineStore('globalState', {
    state: () => ({
        selectedItemsCount: JSON.parse(localStorage.getItem('selectedItems') || '[]').length,
        isOpenSearch: false,
        isOpenMenu: false,
        isMobile: window.matchMedia('(max-width: 768px)').matches,
        currentMenuItem: ''
    }),
    actions: {
        setSelectedItemsCount(count) {
            this.selectedItemsCount = count;
        },
        updateSelectedItemsCount() {
            this.selectedItemsCount = JSON.parse(localStorage.getItem('selectedItems') || '[]').length;
        },
        toggleSearch() {
            this.isOpenSearch = !this.isOpenSearch;
        },
        toggleMenu() {
            this.isOpenMenu = !this.isOpenMenu;
        },
        updateCurrentMenuItem(item) {
            this.currentMenuItem = item;
        }
    },
});


export const useMenuStore = defineStore('menu', {
    state: () => ({
        highlightedMenuItem: null
    }),
    actions: {
        setHighlightedMenuItem(item) {
            this.highlightedMenuItem = item;
        }
    }
});