import request from '@/utils/request';

export const getPassengerList = (memberId: number) => {
    return request.get(`/member/passenger/list/${memberId}`);
};

export const savePassenger = (data: {
    name: string;
    idCard: string;
    type: string;
}) => {
    return request.post('/member/passenger/save', data);
};