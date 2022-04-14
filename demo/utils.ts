import 'reflect-metadata'
export const api = {
	getUsername: () =>
		new Promise(r =>
			setTimeout(() => {
				r('最后的Hibana')
			}, 1000)
		)
}

export const InjectUsername = () => (target: any, key: string) =>
	Reflect.defineMetadata('inject', api.getUsername, target, key)

export function useInject<T extends object>(form: T) {
	for (const key in form) {
		const api = Reflect.getMetadata('inject', form, key)
		if (api) {
			api().then(res => {
				form[key] = res
			})
		}
	}

	return form
}

// class Page {
// 	itemList = ref([])

// 	@Watch(page => page.loadData())
// 	params = reactive({
// 		pageIndex: 1,
// 		pageSize: 15
// 		//...
// 	})

// 	loading = ref(false)

// 	@Message('加载成功', '获取数据失败')
// 	@Loading()
// 	async loadData() {
// 		this.itemList = await getItemList(this.params)
// 	}

// 	@Debounce(1000)
// 	handleLoadClick() {
// 		this.loadData()
// 	}
// }
