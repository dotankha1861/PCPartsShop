import React from 'react'
import { useDispatch } from 'react-redux'
import { deleteCategoryStart } from '../../../redux/slices/categorySlice';
import { cancelOrderStart, updateStatusOrderStart } from '../../../redux/slices/orderSlice';
import Order from '../../../pages/Admin/Order';

const CompleteOrder = ({order, hide}) => {
  const dispatch = useDispatch();
  const handleCompleteOrder = () => {
    dispatch(updateStatusOrderStart({ orderId: order.id, status: "HOANTAT", hide }));
  }

  return (
    <div className='py-5 px-20 flex flex-col gap-3 justify-center items-center shadow-md overflow-hidden w-[600px]'>
          <div className='text-center'>Xác nhận hoàn tất đơn hàng <span className='font-semibold '>#{order.id}</span></div>
              <div className='flex gap-3 my-4 mt-10'>
            <button className='middle none center mr-4 rounded-lg bg-red-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
              onClick={() => hide()}
            >&nbsp;&nbsp;Quay lại&nbsp;&nbsp;</button>
            <button className='middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                onClick={handleCompleteOrder}
              >
              Đồng ý</button>

          </div>
        </div>
  )
}

export default CompleteOrder;