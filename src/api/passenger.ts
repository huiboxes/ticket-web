import request from '@/utils/request';

export const getPassengerList = (params: {
    memberId: number,
    page?: number,
    size?: number
}) => {
    return request.get(`/member/passenger/list`, { params });
};

export const savePassenger = (data: {
    name: string;
    idCard: string;
    type: string;
}) => {
    return request.post('/member/passenger/save', data);
};