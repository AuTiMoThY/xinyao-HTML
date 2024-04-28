(function () {
    const { reactive, readonly, onMounted } = Vue;

    const state = reactive({
        selectedItemsCount: JSON.parse(localStorage.getItem('selectedItems') || '[]').length,
        isXinyao1: false,
        highlightedMenuItem: null,
        isOpenSearch: false,
        isOpenMenu: false,
        isMobile: window.matchMedia('(max-width: 576px)').matches,
        currentUrl: window.location.href,
        isHomePage: false
    });


    const eventBus = {
        state: readonly(state),
        setSelectedItemsCount(count) {
            state.selectedItemsCount = count;
        },
        openXinyao1() {
            state.isXinyao1 = true;
        },
        closeXinyao1() {
            state.isXinyao1 = false;
        },
        setHighlightedMenuItem(item) {  // 新增方法
            state.highlightedMenuItem = item;
        },
        toggleSearch() {
            if (!state.isOpenSearch) {
                state.isOpenSearch = true;
            }
            else {
                state.isOpenSearch = false;
            }
        },
        toggleMenu() {
            if (!state.isOpenMenu) {
                state.isOpenMenu = true;
            }
            else {
                state.isOpenMenu = false;
            }
        },
        updateIsMobile() {
            state.isMobile = window.matchMedia('(max-width: 576px)').matches;
        },
        updateIsHomePage() {
            state.isHomePage = true;
        }
    };



    window.addEventListener('resize', () => {
        let resizeTimeout;
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                eventBus.updateIsMobile();
            }, 66); // Execute at max of 15 fps
        }

    });
    // 将 eventBus 附加到 window 对象上，使其成为全局可访问
    window.eventBus = eventBus;
})();
