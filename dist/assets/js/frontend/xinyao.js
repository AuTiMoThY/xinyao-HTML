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


        const eventBus = window.eventBus;
        const data = ref([]);


        const showPopupSelect = ref(false);
        const hasSelected = computed(() => {
            return selectedParts.value.length > 0;
        });
        const currentSelectedItem = ref(null); // 儲存當前選中的調理項目
        const selectedItems = ref(JSON.parse(localStorage.getItem('selectedItems') || '[]')); // 儲存選中的調理項目 (顯示在側邊欄的數字)
        const selectParts = ref([]);
        const selectedParts = ref([]); // 儲存選中的部位



        const isMobile = ref(globalState.isMobile);
        console.log(isMobile.value);


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
            isMobile.value = globalState.isMobile;
        });


        // ===================================
        //     組件生命周期的起始點
        // ===================================
        // `onMounted` 鉤子：組件掛載到 DOM 後執行。
        onMounted(() => {
            xinyao.log("currentSubCateData", currentSubCateData);
            // if (currentPage.includes("xinyao-1")) {
            //     eventBus.openXinyao1();
            // }
            // else {
            //     eventBus.closeXinyao1();
            // }
            selectedItems.value = JSON.parse(localStorage.getItem('selectedItems') || '[]');
            data.value = currentSubCateData[0].item;
            data.value.forEach(item => {
                item.amount = 1;
            });

            xinyao.log("isMobile", isMobile.value);
            // 判斷是否手機版
            // if (isMobile.value) {
            //     const currentUrl = eventBus.state.currentUrl;

            //     // 判斷是否心藥目錄
            //     if (mainCateId == "1") {
            //         const match = currentUrl.match(/\/xinyao-1\/(\d+)\/(\d+)\/?$/);
            //         xinyao.log("match", match);

            //         if (match) {
            //             const itemId = parseInt(match[2]); // 获取匹配到的項目編號参数

            //             const startIndex = (itemId - 1) * 1;
            //             const endIndex = startIndex + 1;
            //             data.value = currentSubCateData.slice(startIndex, endIndex);
            //             data.value.forEach(item => {
            //                 item.amount = 1;
            //             });
            //         } else {
            //             console.log("未找到URL中的參數");

            //             if (!isHomePage.value) {
            //                 window.location.href = baseUrl;
            //             }
            //         }
            //     }
            //     else {
            //         data.value = currentSubCateData;
            //         data.value.forEach(item => {
            //             item.amount = 1;
            //         });
            //     }
            // }
            // else {
            //     data.value = currentSubCateData[0].item;
            //     data.value.forEach(item => {
            //         item.amount = 1;
            //     });
            // }




            // data.value.forEach(item => {
            //     item.amount = 1;
            // });

            // const updateIsMobile = () => {
            //     isMobile.value = window.matchMedia('(max-width: 576px)').matches;
            //     if(isMobile.value) {

            //         data.value = currentSubCateData.slice(startIndex.value, endIndex.value);

            //     }
            //     else {
            //         data.value = currentSubCateData;
            //     }
            //     totalDatatable.value = currentSubCateData.length;
            //     data.value.forEach(item => {
            //         item.amount = 1; // 默认值为1，或根据需要设置
            //     });

            //     xinyao.log("data", data.value);
            // };

            // // 初始加载时执行一次，以确保isMobile的值正确
            // updateIsMobile();

            // // 添加窗口大小变化时的事件监听器
            // window.addEventListener('resize', updateIsMobile);

            // // 在组件销毁时移除事件监听器，防止内存泄漏
            // onUnmounted(() => {
            //     window.removeEventListener('resize', updateIsMobile);
            // });
        });

        return {
            // ...Pinia.piniaStoreToRefs(globalState), ...globalState,
            data,
            showPopupSelect, selectParts, selectedParts, handleSelection, hasSelected,
            showNotification, notificationTitle, notificationCnt,
            addToList,
            // clearSelectedItems,
            // currentSubCateDatatable, totalDatatable, prevDatatable, nextDatatable,
            isOpenSearch,
            isMobile,
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
