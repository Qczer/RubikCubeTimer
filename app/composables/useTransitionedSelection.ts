export const useTransitionedSelection = <T>() => {
  const selected = ref<T | null>(null)
  const isOpen = ref(false)

  const open = (item: T) => {
    selected.value = item
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  const clearAfterLeave = () => {
    if (!isOpen.value) selected.value = null
  }

  return {
    selected,
    isOpen,
    open,
    close,
    clearAfterLeave
  }
}
