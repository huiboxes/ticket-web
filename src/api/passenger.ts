import request from '@/utils/request';

// export const savePassenger = () => {
//     return request.get('/member/passenger/save');
// };

export const savePassenger = (data: {
    name: string;
    idCard: string;
    type: string;
}) => {
    return request.post('/member/passenger/save', data);
};