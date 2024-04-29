import { amountField, notification } from '../vue-components.js';
import { useOpenSearch, useNotification } from '../vue-composable.js';
import { useGlobalStateStore } from '../globalState.js';

const { ref, createApp, computed, onMounted, watchEffect } = Vue;
const { createPinia } = Pinia;
const favouriteSetup = {
    components: {
        'amount-field': amountField,
        notification
    },
    setup() {
        const { showNotification, notificationTitle, notificationCnt, showNoti, closeNoti } = useNotification();
        const { isOpenSearch } = useOpenSearch();
        const globalState = useGlobalStateStore();
        // console.log(globalState.isMobile);
        const isMobile = ref(globalState.isMobile);
        const eventBus = window.eventBus;
        const data = ref(favData);

        const currentActionMenuIndex = ref(null);

        const favourite_detail_arr = ref([]);
        const favourite_detail_value_sum = ref(0);
        const showPopupDetail = ref(false);
        const showDialog = ref(false);

        const toggleMenu = (index) => {
            if (currentActionMenuIndex.value === index) {
                // 如果点击的是当前已打开的菜单，则关闭它
                currentActionMenuIndex.value = null;

            } else {
                // 否则，设置当前打开的菜单索引为点击的菜单索引
                currentActionMenuIndex.value = index;

            }
        };

        // 顯示明細
        const showDetail = (item) => {
            showPopupDetail.value = true;
            favourite_detail_arr.value = item.p_detail;

            item.p_detail.map(detailItem => favourite_detail_value_sum.value = favourite_detail_value_sum.value + parseInt(detailItem.item_amount));
            xinyao.log("showDetail item", item.p_detail);
        }

        // 運行調理帖，帶該筆資料到挑選中調理帖頁面
        const playItem = (item) => {
            localStorage.removeItem('replay');
            xinyao.log("replay item", item);
            localStorage.setItem('replay', JSON.stringify(item));
            window.location.href = `${baseUrl}cart2_fav.html`;
        }
        // 刪除調理項目，叫出刪除確認對話框
        const removeItem = (index) => {
            showDialog.value = true;
            currentActionMenuIndex.value = index;
        }
        
        // 刪除確認對話框，點擊刪除
        const handleRemove = (index) => {
            data.value.splice(index, 1);
            
            showDialog.value = false;
            currentActionMenuIndex.value = null;
        }

        watchEffect(() => {
            isOpenSearch.value = eventBus.state.isOpenSearch;
        });

        onMounted(() => {

        });

        return {
            data,
            currentActionMenuIndex, toggleMenu,
            showDetail,
            showPopupDetail,
            showDialog,
            favourite_detail_arr, favourite_detail_value_sum,
            playItem,
            removeItem, handleRemove,
            isOpenSearch,
            isMobile
        }
    }

}

const favourite = createApp(favouriteSetup);
const pinia = createPinia();
favourite.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('module-')
}
favourite.use(pinia);
favourite.mount("#favourite");
