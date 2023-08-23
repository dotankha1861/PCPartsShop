import { useDispatch, useSelector } from 'react-redux'
import Table, { AvatarCell, SelectColumnFilter, StatusPill } from '../../components/table/Table'  // new
import React, { useEffect, useRef, useState } from 'react'
import { getAllCategoryStart } from '../../redux/slices/categorySlice'
import { classNames } from '../../components/table/shared/Utils'
import { BiSolidEdit } from 'react-icons/bi';
import { RiDeleteBin5Line } from 'react-icons/ri';
import AddCategory from '../../components/admin/category/AddCategory'
import Modal from '../../components/Modal'
import DeleteCategory from '../../components/admin/category/DeleteCategory'
import UpdateCategory from '../../components/admin/category/UpdateCategory'
import AddPromotion from '../../components/admin/promotion/AddPromotion'
import { getAllPromotionStart } from '../../redux/slices/promotionSlice'
import { formatMoney, getStatusDateBetween } from '../../utils/convert_helper'
import { LuView } from 'react-icons/lu'
import UpdatePromotion from '../../components/admin/promotion/UpdatePromotion'
import DeletePromotion from '../../components/admin/promotion/DeletePromotion'
import AddEmployee from '../../components/admin/employee/AddEmployee'
import { getAllEmployeeStart, updateRoleStart } from '../../redux/slices/employeeSlice'
import { TbLockCancel, TbLockOpen } from "react-icons/tb";
import ActiveEmployee from '../../components/admin/employee/ActiveEmployee'
import DeleteEmployee from '../../components/admin/employee/DeleteEmployee'


const Employee = () => {
	const { currentUser } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const { employees } = useSelector(state => state.employees);
	const roles = React.useMemo(() => {
		return {
			MEMBER: "Thành viên",
			ADMIN: "Quản trị"
		}
	}, []);

	const handleUpdateRole = (role, employeeId) => {
		dispatch(updateRoleStart({employeeId ,role}));
	}
	const genders = React.useMemo(() => {
		return {
			true: "Nam",
			false: "Nữ"
		}
	}, []);

	const columns = React.useMemo(() => [
		{
			Header: "Id",
			accessor: 'employeeId',
			sortable: true,
			Cell: ({ value }) => {
				return (
					<div className="w-[20px]">
						{value}
					</div>
				)
			}
		},
		{
			Header: "Họ và tên",
			accessor: 'fullName',
			sortable: true,
			Cell: ({ row, value }) => {
				return (
					<div className="flex items-center w-fit text-sm text-body">
						<div className="flex-shrink-0 h-10 w-10">
							<img className="h-10 w-10 rounded-full" src={row.original.avatar || "http://localhost:8080/images/setting/avatar-user"} alt="" />
						</div>
						<div className="ml-2">
							<div className="text-sm  text-gray-900">{value}</div>
						</div>
					</div>
				)
			}
		},
		{
			Header: "Liên hệ",
			accessor: '',
			Cell: ({ value, column, row }) => {
				return (
					<div className='flex flex-col gap-2'>
						<div className="flex items-center w-fit text-sm text-body justify-center">
							{row.original.email}
						</div>
						<div className="flex items-center w-fit text-sm text-body justify-center">
							{row.original.phone && "ĐT: " + row.original.phone}
						</div>
					</div>

				)
			}
		},
		{
			Header: "Giới tính",
			accessor: 'male',
			// pairsFilter: genders,
			// Filter: SelectColumnFilter,
			Cell: ({ value, column, row }) => {
				return (
					<div className='flex flex-col gap-2'>
						<div className="flex items-center w-fit text-sm text-body justify-center">
							{value == "true" ? "Nam" : "Nữ"}
						</div>
					</div>

				)
			}
		},
		{
			Header: "Tài khoản",
			accessor: '',
			Cell: ({ value, column, row }) => {
				return (
					<div className='flex flex-col gap-2'>
						<div className="flex items-center w-fit text-sm text-body justify-center">
							{row.original.username}
						</div>
						<div className="flex items-center w-fit text-sm text-body justify-center">
							<div className='flex gap-1 items-center'>
								<div>{row.original.active ? "Hoạt động" : "Đã khóa"}</div>
								<div className={
									classNames(
										"rounded-full w-2 h-2",
										row.original.active ? "bg-green-500" : "bg-red-500",
									)
								}></div>
							</div>

						</div>
					</div>

				)
			}
		},
		{
			Header: "Vai trò",
			accessor: 'role',
			pairsFilter: roles,
			Filter: SelectColumnFilter,
			Cell: ({ value, row }) => {
				const [toggle, setToggle] = useState(false);
				const update = useRef();
				const handleToggle = (e) => {
					if (update.current?.contains(e.target)) {
						setToggle(() => !toggle);
					}
					else if (toggle) setToggle(() => !toggle);
				}

				useEffect(() => {
					document.addEventListener('click', handleToggle);
					return () => document.removeEventListener('click', handleToggle);
				});
				return (
					<div className="text-sm">
						{currentUser.employeeId == row.original.createrId ? <div className='ralative text-yellow-600 cursor-pointer font-semibold text-sm'
						>

							<div className='relative w-[100px] min-w-200px z-1'>
								<button id="dropdownActionButton" data-dropdown-toggle="dropdownAction" class="w-full inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100  focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
									<div ref={update} className='text-center w-full'>{roles[value]}</div>
								</button>
								{
									toggle && <div id="dropdownAction" className={
										classNames(
											"w-full z-10 absolute right-0 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ",
											// position === "TOP" ? "bottom-full" : null
										)
									}>
										<ul class="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownActionButton">

											{Object.keys(roles).map(role => role !== value &&	<li key={role} onClick={() => handleUpdateRole(role, row.original.employeeId)} className='hover:text-gray-70 hover:bg-neutral-200 py-2 px-5'
											>
												{roles[role]}
												
											</li> ) }
										
										</ul>
									</div>
								}
							</div>

						</div> : <div className='flex justify-center'>{roles[value]}</div>}

					</div>
				)
			}
		},
		// {
		// 	Header:  "Ngày bắt đầu",
		// 	accessor: 'effectiveDate',
		// 	Cell: ({ value, column, row }) => {
		// 		return (
		// 			<div className='flex flex-col gap-1 items-start'>
		// 				<div className="flex items-center w-fit text-sm text-body justify-center">
		// 					{row.original.effectiveDate}
		// 				</div>
		// 			</div>

		// 		)
		// 	}
		// },
		// {
		// 	Header: "Ngày kết thúc",
		// 	accessor: 'expirationDate',
		// 	Cell: ({ value, column, row }) => {
		// 		return (
		// 			<div className='flex flex-col gap-1 items-start'>
		// 			<div className="flex items-center w-fit text-sm text-body justify-center">
		// 					 {value}
		// 				</div>
		// 		</div>
		// 		)
		// 	}
		// },
		{
			Header: "Nhân viên tạo",
			accessor: 'createrId',
			pairsFilter: {
				...employees?.reduce((object, item) =>
					({ ...object, [item.employeeId]: item.employeeId + " - " + item.lastName + " " + item.firstName }), {}), "null": "Không có"
			},
			Filter: SelectColumnFilter,
			Cell: ({ value, column, row }) => {
				const index = row.original.createdAt.lastIndexOf(' ');
				const employee = employees?.find(employee => employee.employeeId == value);
				return (
					<div className='flex flex-col gap-2'>
						{value ? <div className="flex items-center w-fit text-sm text-body justify-center">
							#{value} - {employee?.lastName + " " + employee?.firstName}
						</div> : <div className="flex items-center w-fit text-sm text-body justify-center">Không</div>}
						<div className="flex items-center w-fit text-sm text-body justify-center">
							{row.original.createdAt.substring(0, index)}
						</div>
						<div className="flex items-center w-fit text-sm text-body justify-center">
							{row.original.createdAt.substring(index + 1)}
						</div>
					</div>

				)
			}
		},
		// {
		// 	Header: "Trạng thái",
		// 	accessor: "status",
		// 	pairsFilter: promotionStatus,
		// 	Filter: SelectColumnFilter,
		// 	Cell: ({ value }) => {
		// 		return (
		// 			<span
		// 				className={
		// 					classNames(
		// 						"px-3 py-1 uppercase leading-wide font-bold text-xs rounded-full shadow-sm",
		// 						value === "DANGAPDUNG" ? "bg-green-100 text-green-800" : null,
		// 						value === "CHUAAPDUNG" ? "bg-yellow-100 text-yellow-800" : null,
		// 						value === "HETHIEULUC" ? "bg-red-100 text-red-800" : null,
		// 					)
		// 				}
		// 			>
		// 				{promotionStatus[value]}
		// 			</span>
		// 		)
		// 	}
		// },
		// {
		// 	Header: "Trạng thái",
		// 	accessor: "active",
		// 	pairsFilter: categoryStatuses,
		// 	Filter: SelectColumnFilter,
		// 	Cell: ({ value }) => {
		// 		return (
		// 			<div className={
		// 				classNames(
		// 					"px-3 py-1 uppercase leading-wide font-medium text-xs rounded-full shadow-sm w-fit",
		// 					value === "true" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
		// 				)
		// 			}>{categoryStatuses[value]}</div>
		// 		)
		// 	}
		// },
		{
			Header: "Tính năng",
			accessor: "",
			Cell: ({ row }) => {
				return <div className='flex gap-3 '>

					{currentUser.employeeId == row.original.createrId && <div className='flex gap-3 '>
						{row.original.active ?
							<TbLockCancel size={24} className='text-orange-600 cursor-pointer'
								onClick={() => {
									setEmployeeSelected(row.original);
									activeModal.current.show();
								}} /> : <TbLockOpen size={24} className='text-blue-600 cursor-pointer'
									onClick={() => {
										setEmployeeSelected(row.original);
										activeModal.current.show();
									}} />}
						<RiDeleteBin5Line size={24} className='text-red-600 cursor-pointer'
							onClick={() => {
								setEmployeeSelected(row.original);
								deleteModal.current.show();
							}} />
					</div>}

				</div>
			}
		}

	], [])

	const addModal = useRef();
	const deleteModal = useRef();
	const activeModal = useRef();

	const [employeeSelected, setEmployeeSelected] = useState();

	const data = React.useMemo(() => {
		return employees.map((employee) => {
			//  const status = getStatusDateBetween(employee.effectiveDate, employee.expirationDate);
			return { ...employee, male: employee.male ? "true" : "false" ,fullName: employee.lastName + " " + employee.firstName }
		})
	}, [employees]);

	const handleReset = () => {
		dispatch(getAllEmployeeStart({ action: "reset" }))
	}

	useEffect(() => {
		dispatch(getAllEmployeeStart());
	}, [dispatch])

	return (
		<div className="h-[80%] text-gray-900">
			<main className="sm:px-6 lg:px-8 pt-4">
				<div className="flex justify-start">
					<h1 className="text-xl font-bold">DANH SÁCH NHÂN VIÊN</h1>
					<div className='ml-auto'>
						<button
							class="middle none center mr-4 rounded-lg bg-blue-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
							data-ripple-light="true"
							onClick={handleReset}>
							Làm mới
						</button>
						<button
							className="middle none center mr-4 rounded-lg bg-green-500 py-2 px-3 font-sans text-xs font-bold uppercase text-white shadow-md shadow-green-500/20 transition-all hover:shadow-lg hover:shadow-green-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
							data-ripple-light="true"
							onClick={() => addModal.current.show()}>
							Tạo mới
						</button>
					</div>

				</div>
				<div className="mt-6">
					<Table columns={columns} data={data} />
				</div>
			</main>
			<Modal title={"THÊM NHÂN VIÊN"} ref={addModal}><AddEmployee hide={() => addModal.current.hide()} /></Modal>
			<Modal title={"XÓA NHÂN VIÊN"} ref={deleteModal}><DeleteEmployee employee={employeeSelected} hide={() => deleteModal.current.hide()} /></Modal>
			<Modal ref={activeModal} title={employeeSelected?.active ? "KHÓA NGƯỜI DÙNG" : "MỞ KHÓA NGƯỜI DÙNG"}><ActiveEmployee employee={employeeSelected} hide={() => activeModal.current.hide()} /></Modal>
		</div>
	);
}

export default Employee;














// import React, { useEffect, useRef, useState } from 'react'
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import Card from '../../components/Card';
// import { useDispatch, useSelector } from 'react-redux';
// import { getAllEmployeeStart } from '../../redux/slices/employeeSlice';
// import { Paper } from '@mui/material';
// import { AiOutlineUserAdd } from 'react-icons/ai';
// import Modal from '../../components/Modal';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { BiCloudUpload } from "react-icons/bi";

// const columns = [
// 	{ id: 'employeeId', label: 'Mã NV', minWidth: 50 },
// 	{
// 		id: 'fullName',
// 		label: 'Họ và tên',
// 		minWidth: 120,
// 		align: 'left',
// 		// format: (value) => value.toLocaleString('en-US'),
// 	},
// 	{
// 		id: 'createdAt',
// 		label: 'Ngày tạo',
// 		minWidth: 170,
// 		align: 'left',
// 		// format: (value) => value.toFixed(2),
// 	},
// 	{
// 		id: 'role',
// 		label: 'Vai trò',
// 		minWidth: 70,
// 		align: 'center',
// 		// format: (value) => value.toFixed(2),
// 	},
// 	{
// 		id: 'active',
// 		label: 'Trạng thái',
// 		minWidth: 170,
// 		align: 'right',
// 		// format: (value) => value.toFixed(2),
// 	},
// 	{
// 		id: 'func',
// 		label: '',
// 		minWidth: 170,
// 		align: 'center',
// 		custom: () => {
// 			return (
// 				<div className='flex items-center gap-5 justify-center'>
// 					<div className='text-blue-800'>Xem</div>
// 					<div className='text-red-600'>Xóa</div>
// 				</div>
// 			)
// 		}
// 	}
// ];

// const Employee = () => {
// 	const [page, setPage] = useState(0);
// 	const [rowsPerPage, setRowsPerPage] = useState(100);
// 	const dispatch = useDispatch();
// 	const { isFetching, error, employees, success } = useSelector(state => state.employees);
// 	const modalAddEmployee = useRef();

// 	const createData = (employee, index) => {
// 		return {
// 			[columns[0].id]: employee.employeeId,
// 			[columns[1].id]: employee.lastName + " " + employee.firstName,
// 			[columns[2].id]: employee.createdAt,
// 			[columns[3].id]: employee.role === "SUPER" ? "Quản lý" : "Quản trị",
// 			[columns[4].id]: employee.active ? "Đang hoạt động" : "Ngưng hoạt động"
// 		}
// 	}

// 	const handleChangePage = (event, newPage) => {
// 		setPage(newPage);
// 	};

// 	const handleChangeRowsPerPage = (event) => {
// 		setRowsPerPage(+ event.target.value);
// 		setPage(0);
// 	};

// 	const handleClickAdd = () => {
// 		modalAddEmployee.current.hide();
// 		toast.success('Wow so easy!', {
// 			position: "top-right",
// 			autoClose: 3000,
// 			hideProgressBar: false,
// 			closeOnClick: true,
// 			pauseOnHover: true,
// 			draggable: true,
// 			progress: undefined,
// 			theme: "light",
// 		});
// 	}

// 	useEffect(() => {
// 		dispatch(getAllEmployeeStart());
// 	}, [dispatch]);
// 	return (
// 		<div className='flex flex-col gap-4 m-5'>
// 			<ToastContainer
// 				position="top-right"
// 				autoClose={3000}
// 				hideProgressBar={false}
// 				newestOnTop={false}
// 				closeOnClick
// 				rtl={false}
// 				pauseOnFocusLoss
// 				draggable
// 				pauseOnHover
// 				theme="light"
// 			/>
// 			<h1 className='mt-2 font-bold text-2xl'>
// 				Danh sách nhân viên
// 			</h1>
// 			<div className='h-9 flex items-center drop-shadow-sm'>
// 				<div className='flex ml-auto items-center w-fit gap-1 button py-[7px] border-0 shadow-md'
// 					onClick={() => modalAddEmployee.current.show()}		>
// 					<div variant="contained" className='text-green-600'>
// 						Thêm mới
// 					</div>
// 					{/* <AiOutlineUserAdd size={24} className='text-green-700' /> */}
// 				</div>
// 			</div>
// 			<div className='w-full h-full border-[1.2px] rounded-md border-neutral-200 z-1'>
// 				<TableContainer sx={{ maxHeight: 350, overflowY: "scroll" }} component={Paper}>
// 					<Table stickyHeader aria-label="sticky table">
// 						<TableHead sx={{ zIndex: 1 }}>
// 							<TableRow>
// 								{columns.map((column) => (
// 									<TableCell
// 										key={column.id}
// 										align={column.align}
// 										style={{ minWidth: column.minWidth, height: "0px" }}>
// 										{column.label}
// 									</TableCell>
// 								))}
// 							</TableRow>
// 						</TableHead>
// 						<TableBody>
// 							{employees
// 								.map((row, index) => {
// 									return (
// 										<TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
// 											{columns.map((column) => {
// 												const value = createData(row, index)[column.id];
// 												return (
// 													<TableCell key={column.id} align={column.align}>
// 														{column.format && typeof value === 'number'
// 															? column.format(value)
// 															: value}
// 														{column.custom && column.custom()}
// 													</TableCell>
// 												);
// 											})}
// 										</TableRow>
// 									);
// 								})}
// 						</TableBody>
// 					</Table>
// 				</TableContainer>
// 			</div>
// 			<TablePagination className='fixed bottom-5 right-5'
// 				rowsPerPageOptions={[100]}
// 				component="div"
// 				count={employees.length}
// 				rowsPerPage={rowsPerPage}
// 				page={page}
// 				onPageChange={handleChangePage}
// 				onRowsPerPageChange={handleChangeRowsPerPage}
// 				labelDisplayedRows={({ from, to, count }) => `Số hàng mỗi trang: 100 ----------- ${from}-${to} trong tổng số ${count}`}
// 				labelRowsPerPage="Số hàng mỗi trang:"
// 				labelPagination="Trang:"
// 			/>
// 			<Modal ref={modalAddEmployee}>
// 				<div className="flex flex-col items-center p-5 gap-5 ">
// 					<div className='font-bold text-xl'>THÊM NHÂN VIÊN</div>
// 					<div className='flex gap-3 mb-10'>
// 						<fieldset className=' w-[25%] py-10 flex flex-col items-center px-6 bg-white drop-shadow-md shadow-inner rounded-xl gap-10 text-black'>
// 							<div className='flex flex-col items-center gap-2'>
// 								<img src="http://localhost:8080/images/setting/avatar-user" alt="Avatar"
// 									className='w-[150px] h-[150px] shadow-md rounded-full overflow-hidden text-center align-middle'>
// 								</img>
// 								<input
// 									type="file" id="file-input"
// 									class="hidden"
// 								/>
// 								<label id="file-input-label" for="file-input" className='flex items-center gap-2 text-sm text-slate-500
//         						file:mr-4 file:py-2 file:px-4 file:rounded-md
// 										file:border-0 file:text-sm file:font-semibold
// 									file:bg-blue-50 file:text-blue-700
// 									hover:file:bg-blue-100'>
// 									<span>Tải ảnh lên</span>
// 									<BiCloudUpload size={24} />
// 								</label>
// 								<p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">PNG, JPG</p>
// 							</div>
// 						</fieldset>
// 						<fieldset className='w-[50%] py-10 flex flex-col items-center px-6 bg-white drop-shadow-md shadow-inner rounded-xl gap-10 text-black'>
// 							<div className='flex gap-7 items-center w-full'>
// 								<div className='w-[65%] flex justify-start gap-2 items-center'>
// 									<label htmlFor='last-name'>
// 										Họ
// 									</label>
// 									<input type='text'
// 										id="last-name"
// 										className='input w-full'>
// 									</input>
// 								</div>
// 								<div className='w-[35%] flex justify-start gap-2 items-center'>
// 									<label htmlFor='first-name'>
// 										Tên
// 									</label>
// 									<input type='text'
// 										id="first-name"
// 										className='input w-full'>
// 									</input>
// 								</div>
// 							</div>

// 							<div className='w-[100%] flex justify-start gap-2 items-center'>
// 								<label htmlFor='email'>
// 									Email
// 								</label>
// 								<input type='text'
// 									id="email"
// 									className='input w-full' >
// 								</input>
// 							</div>

// 							<div className="flex gap-7 items-center w-full ">
// 								<div className='w-[50%] flex justify-start gap-2 items-center self-start'>
// 									<label htmlFor='phone'
// 										className='w-fit whitespace-nowrap'>
// 										Số ĐT
// 									</label>
// 									<input type='text'
// 										id="phone"
// 										className='input w-full' >
// 									</input>
// 								</div>

// 								<div className='flex w-[50%] self-start gap-1 items-center'>
// 									<label className='whitespace-nowrap'>
// 										Giới tính
// 									</label>
// 									<div className='flex justify-center w-full gap-5'  >
// 										<div>
// 											<input type='radio' id="male" name="gender" />
// 											<label htmlFor='male'>Nam</label>
// 										</div>
// 										<div>
// 											<input type='radio' id="female" name="gender" />
// 											<label htmlFor='female'>Nữ</label>
// 										</div>
// 									</div>
// 								</div>
// 							</div>

// 							<div className="flex gap-7 items-center w-full">
// 								<div className='w-[50%] flex justify-start gap-2 items-center self-start'>
// 									<label htmlFor='role'
// 										className='w-fit whitespace-nowrap'>
// 										Vai trò
// 									</label>
// 									<select name="role"
// 										id="role"
// 										data-te-select-init
// 										className='input w-full' >
// 										<option value="SUPER" className='block'>SUPER - Quản lý</option>
// 										<option value="ADMIN" className='block'>ADMIN - Quản trị</option>
// 									</select>
// 								</div>
// 							</div>

// 						</fieldset>
// 						<fieldset className=' w-[30%] flex flex-col justify-start items-center px-3 bg-white drop-shadow-md shadow-inner rounded-xl text-black'>
// 							<div className='font-semibold m-10'>TÀI KHOẢN</div>
// 							<div className='flex flex-col gap-10'>
// 								<div className='flex justify-start gap-2 items-center w-full'>
// 									<label htmlFor='username'
// 										className='whitespace-nowrap w-[50%]'>Tên tài khoản</label>
// 									<input type='text' id="username"
// 										className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-[50%]'>
// 									</input>
// 								</div>
// 								<div className='flex justify-start gap-2 items-center w-full'>
// 									<label htmlFor='text'
// 										className='whitespace-nowrap w-[50%]'>
// 										Mật khẩu
// 									</label>
// 									<input type='password' id="password"

// 										className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-[50%]'>
// 									</input>
// 								</div>
// 								<div className='flex justify-start gap-2 items-center w-full'>
// 									<label htmlFor='password'
// 										className='whitespace-nowrap w-[50%]'>
// 										Xác nhận mật khẩu
// 									</label>
// 									<input type='password' id="password"

// 										className='rounded-md px-2 focus:outline-none border-[1.5px] py-[2px] w-[50%]'>
// 									</input>
// 								</div>
// 							</div>

// 						</fieldset>
// 					</div>

// 					<div className='gap-2 fixed bottom-0 w-full bg-slate-100 p-1 right-0 flex justify-end'>
// 						<button className="button"
// 							onClick={() => modalAddEmployee.current.hide()}>
// 							Hủy
// 						</button>
// 						<button className="button"
// 							onClick={handleClickAdd}>
// 							Thêm
// 						</button>
// 					</div>
// 				</div>
// 			</Modal>
// 		</div>
// 	);
// }

// export default Employee;