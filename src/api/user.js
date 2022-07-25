import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/getinfo',
    method: 'post',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function getlist(data) {
  return request({
    url: '/admin/getadminlist',
    method: 'post',
    data: data,
	  // headers: {
		//   "Content-Type": "multipart/form-data"
	  //   },
//     headers: {
// 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' // 设置完以后 传入的params对象就会时候用formdata传参的方式
// },
  })
}