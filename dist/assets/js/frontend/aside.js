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
        // const isOpenSearch = ref(eventBus.state.isOpenSearch);
        
        
        // const isMobile = ref(eventBus.state.isMobile);
        const isMobile = ref(globalState.isMobile);
        
        // const currentUrl = ref(eventBus.state.currentUrl);
        const isHomePage = ref(eventBus.state.isHomePage);
        // console.log(currentUrl);
        // console.log(baseUrl);
        

        const handleSearch = () => {
            eventBus.toggleSearch();
            isOpenSearch.value = eventBus.state.isOpenSearch;
        }

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

                // 檢查當前項目是否有子列表
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
                        // 根據 "open-sublist" 類的存在與否來控制子列表的顯示狀態
                        // sublist.style.display = item.classList.contains('open-sublist') ? 'block' : 'none';

                    });
                }
            });

            // if (currentUrl === 'http:' + baseUrl) {
            //     isHomePage.value = true;
            // }

            new SimpleBar(document.querySelector('.site_aside-bd'));

            menuStore.setHighlightedMenuItem(currentMenuItem);

        });
        return {
            cart_num,
            eventBus,
            handleSearch, isOpenSearch,
            handleMenu, isOpenMenu,
            isMobile,
            isHomePage,
            menuStore
        }
    }
};


const aside = createApp(asideSetup);
const pinia = createPinia();
aside.use(pinia);
aside.mount("#Aside");