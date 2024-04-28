const { ref, computed, watch, watchEffect, onMounted, onUnmounted } = Vue;

export function useNotification() {
    const showNotification = ref(false);
    const notificationTitle = ref('');
    const notificationCnt = ref('');
    let notificationCallback = null;

    const showNoti = (title, cnt, callback) => {
        showNotification.value = true;
        notificationTitle.value = title;
        notificationCnt.value = cnt;

        setTimeout(() => {
            closeNoti(callback);
        }, 3000);
    };

    const closeNoti = (callback) => {
        showNotification.value = false;
        notificationTitle.value = '';
        notificationCnt.value = '';
        if (callback) {
            callback(); // 在关闭通知后调用回调函数
        }
    };

    return { showNotification, notificationTitle, notificationCnt, showNoti, closeNoti };
}


export function useApi() {
    const data = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const fetchData = async (url, params, callback) => {
        loading.value = true;
        error.value = null;
        data.value = null;

        try {
            const response = await axios.get(url, { params });
            data.value = response.data.data;  // 根據實際返回的數據結構進行調整
            if (callback && typeof callback === 'function') {
                callback(response.data);
            }
        } catch (err) {
            error.value = err;
            console.error('Failed to fetch data:', err);
            if (err.response && err.response.data.message) {
                console.error(err.response.data.message);
            }
        } finally {
            loading.value = false;
        }
    };

    return { data, loading, error, fetchData };
}


export function useSorting(formType, fetchData) {
    const sorting = ref({
        field: '',  // 排序字段，如 'budget' 或 'location'
        order: ''   // 排序顺序，'asc' 或 'desc'
    });
    console.log(sorting.value);
    const updateSorting = async (field) => {


        // // 根據查詢參數初始化 Vue ref
        // if (startDate && endDate) {
        //     filterDate.value = [startDate, endDate];
        // }
        // if (status) {
        //     filterStatus.value = status;
        // }

        // if (startDate !== null || endDate !== null || status !== null) {
        //     showClearFilters.value = true;
        // }

        sorting.value.field = field;
        if (sorting.value.order === '') {
            sorting.value.order = 'asc'; // 无排序到升序
        } else if (sorting.value.order === 'asc') {
            sorting.value.order = 'desc'; // 升序到降序
        } else {
            sorting.value.order = ''; // 降序到无排序
            // history.pushState(null, '', window.location.pathname);
            const queryParams = new URLSearchParams(window.location.search);
            let startDate = queryParams.get('startDate');
            let endDate = queryParams.get('endDate');
            let status = queryParams.get('status');
            let page = queryParams.get('page');

            const queryParamsNew = new URLSearchParams();
            if (startDate !== null || endDate !== null || status !== null) {
                // showClearFilters.value = true;
                queryParamsNew.set('startDate', startDate);
                queryParamsNew.set('endDate', endDate);
                queryParamsNew.set('status', status);
            }
            if (page !== null) {
                queryParamsNew.set('page', page);
            }
            history.pushState(null, '', '?' + queryParamsNew.toString());

            // const queryParams = new URLSearchParams(window.location.search);
            await fetchData(`/yuanadmin/api/form-datatable/${formType}`, queryParamsNew, (response) => {
                // 你可以在这里处理响应数据或执行回调
                console.log('Sorted data fetched successfully:', response);
            });
            // try {
            //     const response = await axios.get(`/yuanadmin/api/form-datatable/${formType}`);

            //     yuanUI.log("response:", response);
            //     datatableData.value = response.data.data;
            // } catch (error) {
            //     console.error('updateSorting Error', error);
            //     console.error(error.response.data.message);
            // }

            return;
        }

        const queryParams = new URLSearchParams(window.location.search);
        let sort = queryParams.set('sort', sorting.value.field);
        let order = queryParams.set('order', sorting.value.order);
        // 获取排序后的数据
        console.log(sorting.value);
        history.pushState(null, '', '?' + queryParams.toString());
        await fetchData(`/yuanadmin/api/form-datatable/${formType}`, queryParams, (response) => {
            // 你可以在这里处理响应数据或执行回调
            console.log('Sorted data fetched successfully:', response);
        });
        // try {
        //     const response = await axios.get(`/yuanadmin/api/form-datatable/${formType}`, {
        //         params: queryParams
        //     });

        //     yuanUI.log("response:", response);
        //     datatableData.value = response.data.data;
        // } catch (error) {
        //     console.error('updateSorting Error', error);
        //     console.error(error.response.data.message);
        // }
    };

    const sortIconClass = (field) => {

        return {
            'fa-sort': sorting.value.order === '',
            'fa-sort-up': sorting.value.field === field && sorting.value.order === 'asc',
            'fa-sort-down': sorting.value.field === field && sorting.value.order === 'desc'
        }
    };

    return {
        sorting, updateSorting, sortIconClass
    }
}

export function useOpenSearch() {
    const eventBus = window.eventBus;
    const isOpenSearch = ref(eventBus.state.isOpenSearch);
    watchEffect(() => {
        isOpenSearch.value = eventBus.state.isOpenSearch;
    });
    return {
        isOpenSearch
    }
}