import { amountField, notification } from '../vue-components.js';
import { useNotification, useOpenSearch } from '../vue-composable.js';
import { useGlobalStateStore } from '../globalState.js';

const { ref, createApp, computed, onMounted, onUnmounted, watchEffect } = Vue;
const { createPinia } = Pinia;
const xinyaoListSetup = {
    components: {
        'amount-field': amountField,
        notification
    },
    setup() {

        const { showNotification, notificationTitle, notificationCnt, showNoti, closeNoti } = useNotification();
        const { isOpenSearch } = useOpenSearch();

        const globalState = useGlobalStateStore();
        // const isOpenSearch = globalState.isOpenSearch;

        const eventBus = window.eventBus;
        const data = ref([]);


        const showPopupSelect = ref(false);
        const hasSelected = computed(() => {
            return selectedParts.value.length > 0;
        });
        const selectParts = ref([]);
        const selectedParts = ref([]); // 用于存储选中的部位名称


        const currentSelectedItem = ref(null); // 用于存储当前选中的调理项目
        const selectedItems = ref(JSON.parse(localStorage.getItem('selectedItems') || '[]')); // 用于存储选中的调理项目

        const isMobile = ref(eventBus.state.isMobile);
        const isHomePage = ref(eventBus.state.isHomePage);

        if (eventBus.state.currentUrl === baseUrl || eventBus.state.currentUrl === "http://localhost:3000/") {
            eventBus.updateIsHomePage();
        }

        // 加入挑選中調理帖
        const addToList = (item) => {
            // 取調理項目名稱、id
            // xinyao.log("addToList() item", item);
            currentSelectedItem.value = {
                name: item.name,
                amount: item.amount
            };
            const parts = item.parts;
            openPopup(parts);
            // xinyao.log("addToList() currentSelectedItem.value", currentSelectedItem.value);
        }

        // 開啟彈出視窗，顯示部位
        const openPopup = (parts) => {
            // xinyao.log("openPopup parts", parts);
            selectParts.value = parts; // 當前項目的部位資訊
            showPopupSelect.value = true; // 显示弹窗
        };

        // 關閉彈出視窗
        const closePopup = () => {
            selectParts.value = [];
            showPopupSelect.value = false;
            selectedParts.value = [] // 清空選擇的部位
        };

        // 選擇部位，"無/未知"或"確認"
        const handleSelection = (isUnknown) => {

            if (isUnknown) {
                // 點擊"無/未知"
                selectedItems.value.push(currentSelectedItem.value);
                addToCart();
            } else {
                // 點擊"確認"
                if (selectedParts.value.length > 0) {
                    // selectedItems.value.push({
                    //     ...currentSelectedItem.value,
                    //     selectedParts: selectedParts.value
                    // });
                    selectedParts.value.forEach(part => {
                        selectedItems.value.push({
                            ...currentSelectedItem.value,
                            part: part
                        });
                    });
                    addToCart();
                } else {
                    alert('請至少選擇一個部位');
                }
            }

            xinyao.log("selectedItems.value", selectedItems.value);
        };

        // 加入的項目儲存在localStorage
        const addToCart = () => {
            localStorage.setItem('selectedItems', JSON.stringify(selectedItems.value));

            globalState.updateSelectedItemsCount();

            showNoti('加入成功', `您可以到<a class="link" href="${baseUrl}cart.html">挑選中調理帖</a>查看已加入的調理項目。`);
            closePopup();
        };


        // const clearSelectedItems = () => {
        //     localStorage.removeItem('selectedItems');
        //     // 如果你需要更新组件内的反应式状态，确保也重置它
        //     selectedItems.value = [];
        // };

        watchEffect(() => {
            isHomePage.value = eventBus.state.isHomePage;
            isMobile.value = eventBus.state.isMobile;
        });
        xinyao.log("isHomePage", isHomePage.value);


        onMounted(() => {
            xinyao.log("searchResult", searchResult);

            selectedItems.value = JSON.parse(localStorage.getItem('selectedItems') || '[]');


            xinyao.log("isMobile", isMobile.value);
            // 判斷是否手機版
            if (isMobile.value) {
                const currentUrl = eventBus.state.currentUrl;

                // 判斷是否心藥目錄
                if (mainCateId == "1") {
                    const match = currentUrl.match(/\/xinyao-1\/(\d+)\/(\d+)\/?$/);
                    xinyao.log("match", match);

                    if (match) {
                        const itemId = parseInt(match[2]); // 获取匹配到的項目編號参数

                        const startIndex = (itemId - 1) * 1;
                        const endIndex = startIndex + 1;
                        data.value = searchResult.slice(startIndex, endIndex);
                        data.value.forEach(item => {
                            item.amount = 1;
                        });
                    } else {
                        console.log("未找到URL中的參數");

                        if (!isHomePage.value) {
                            window.location.href = baseUrl;
                        }
                    }
                }
                else {
                    data.value = searchResult;
                    data.value.forEach(item => {
                        item.amount = 1;
                    });
                }
            }
            else {
                data.value = searchResult[0].item;
                data.value.forEach(item => {
                    item.amount = 1;
                });
            }
        });

        return {
            // ...Pinia.piniaStoreToRefs(globalState), ...globalState,
            data,
            showPopupSelect, selectParts, selectedParts, handleSelection, hasSelected,
            showNotification, notificationTitle, notificationCnt,
            addToList,
            // clearSelectedItems,
            // searchResulttable, totalDatatable, prevDatatable, nextDatatable,
            isOpenSearch,
            isMobile,
            isHomePage
        }
    }

}

const xinyaoList = createApp(xinyaoListSetup);
const pinia = createPinia();
xinyaoList.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('module-')
}
xinyaoList.use(pinia);
xinyaoList.mount("#xinyaoList");
