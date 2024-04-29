import { useGlobalStateStore, useMenuStore } from '../globalState.js';
import { useOpenSearch } from '../vue-composable.js';

const { ref, createApp, computed, onMounted, onUnmounted, watchEffect } = Vue;
const { createPinia } = Pinia;

const asideSetup = {
    setup() {
        const { isOpenSearch } = useOpenSearch();

        const eventBus = window.eventBus;
        const globalState = useGlobalStateStore();
        const menuStore = useMenuStore();

        const cart_num = ref(globalState.selectedItemsCount);
        const isOpenMenu = ref(eventBus.state.isOpenMenu);
        const isMobile = ref(globalState.isMobile);
        const highlightMenuItem = ref(currentMenuItem);
        
        // 搜尋開關
        const handleSearch = () => {
            eventBus.toggleSearch();
            isOpenSearch.value = eventBus.state.isOpenSearch;
        }

        // 選單開關
        const handleMenu = () => {
            eventBus.toggleMenu();
            isOpenMenu.value = eventBus.state.isOpenMenu;
            const simpleBar = new SimpleBar(document.querySelector('.site_aside-bd'));
            simpleBar.recalculate();
        }

        watchEffect(() => {
            cart_num.value = globalState.selectedItemsCount;
            isOpenMenu.value = eventBus.state.isOpenMenu;
            isMobile.value = globalState.isMobile;
        });

        onMounted(() => {
            // 選擇所有的菜單項目
            const menuItems = document.querySelectorAll('.site_menu-item');

            menuItems.forEach(item => {
                const sublist = item.querySelector('.sublist');
                const title = item.querySelector('.inner');

                // 檢查當前項目是否有子列表，有的話加上arrow icon
                if (sublist && title) {
                    item.classList.add('has-sublist');
                    // 創建 SVG 元素
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    // 在這裡添加您的 SVG 屬性
                    svg.setAttribute('data-src', baseUrl + 'assets/images/arrow-down.svg');
                    // 將 SVG 添加到標題中
                    title.appendChild(svg);

                    // 為標題添加點擊事件監聽器
                    title.addEventListener('click', () => {
                        // 切換 "open-sublist" 類
                        item.classList.toggle('open-sublist');
                    });
                }
            });

            // 滾動條
            new SimpleBar(document.querySelector('.site_aside-bd'));

            // 高亮顯示當前選單
            menuStore.setHighlightedMenuItem(highlightMenuItem.value);

        });
        return {
            cart_num,
            eventBus,
            handleSearch, isOpenSearch,
            handleMenu, isOpenMenu,
            isMobile,
            menuStore,
            highlightMenuItem
        }
    }
};


const aside = createApp(asideSetup);
const pinia = createPinia();
aside.use(pinia);
aside.mount("#Aside");