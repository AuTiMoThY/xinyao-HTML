import { amountField, notification } from '../vue-components.js';
import { useNotification, useOpenSearch } from '../vue-composable.js';
import { useGlobalStateStore } from '../globalState.js';

const { ref, createApp, computed, onMounted, watchEffect } = Vue;
const historySetup = {
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
        const data = ref(historyData);
        const showDialog = ref(false);
        const showPopupDetail = ref(false);
        const currentActionMenuIndex = ref(null); // 保存当前打开的菜单的索引
        const history_detail_arr = ref([]);
        const history_detail_value_sum = ref(0);
        // const history_detail_value_sum = computed(() => {
        //     if (!showPopupDetail.value) {
        //         return 0;
        //     }
        // });

        const setStatusClass = (item) => {
            let statusClass = '';
            switch (item.status) {
                case "等待中":
                    statusClass = 'txt-sub-color'
                    break;
                case "運行中":
                    statusClass = 'txt-success'
                    break;
                case "已取消":
                    statusClass = 'txt-danger'
                    break;
            }
            return statusClass;
        }

        const toggleMenu = (index) => {
            if (currentActionMenuIndex.value === index) {
                // 如果点击的是当前已打开的菜单，则关闭它
                currentActionMenuIndex.value = null;
            } else {
                // 否则，设置当前打开的菜单索引为点击的菜单索引
                currentActionMenuIndex.value = index;
            }
        };



        const showDetail = (item) => {

            showPopupDetail.value = true;
            history_detail_arr.value = item.p_detail

            item.p_detail.map(detailItem => history_detail_value_sum.value = history_detail_value_sum.value + parseInt(detailItem.item_amount));
            xinyao.log("showDetail item", item.p_detail);
        }

        const closePopupDetail = () => {
            showPopupDetail.value = false;
            history_detail_arr.value = [];
            history_detail_value_sum.value = 0;
        }

        const openCancel = () => {
            showDialog.value = true;
        }

        const handleCancel = (item) => {
            showNoti('取消成功', `調理帖<span class="link">${item.p_name}</span>已成功取消運行。`, () => {
                showDialog.value = false;
            });
        }
        const replay = (item) => {
            localStorage.removeItem('replay');
            xinyao.log("replay item", item);
            localStorage.setItem('replay', JSON.stringify(item));
            window.location.href = `${baseUrl}cart2`;
        }
        const addFav = () => {
            showNoti('加入成功', `您可以到<a class="link" href="${baseUrl}favourite.html">常用調理帖</a>查看已加入的調理帖。`, () => {
                showDialog.value = false;
            });
        }


        onMounted(() => {
        });


        return {
            data,
            setStatusClass,
            currentActionMenuIndex, toggleMenu,
            showPopupDetail, closePopupDetail,
            showDetail, history_detail_arr, history_detail_value_sum,
            openCancel, handleCancel,
            replay,
            addFav,
            showDialog,
            showNotification, notificationTitle, notificationCnt,
            isOpenSearch,
            isMobile
        }
    }

}

const history = createApp(historySetup);
history.config.compilerOptions.isCustomElement = (tag) => {
    return tag.startsWith('module-')
}
history.mount("#history");
