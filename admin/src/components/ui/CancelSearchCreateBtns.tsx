type Props = {
    onCancel: () => void;
    onCreate: () => void;
    isValid: boolean;
    isLoading: boolean;
}

export const CancelSearchCreateBtns = ({onCancel, isValid, isLoading, onCreate}: Props) => {
    return <div className='flex gap-4 justify-end mt-4'>
        <button type='button' className='btn btn-outline' onClick={onCancel}>Đặt lại</button>
        <button type='submit' className='btn btn-primary' disabled={!isValid}>
            {isLoading && <span className="loading loading-spinner"></span>}
            Tìm kiếm
        </button>
        <button type='button' className='btn btn-primary' onClick={onCreate}>Tạo mới</button>
    </div>
}