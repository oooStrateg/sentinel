import * as types from './../Constants/action.names';
import { B_URL, TMain_URL } from './../Constants/constants';
import { removeSessionLocal } from './../Utils/DisconnectVpn';
import axios from 'axios';
import { axiosInstance } from './AxiosGlobalConfig'
export function setListViewType(component) {
    return {
        type: types.LIST_TYPE,
        payload: component
    }
}

export async function getVpnList(vpnType, isTM) {
    try {
        let listUrl;
        // let uri = localStorage.getItem('B_URL')
        // if (uri && uri === B_URL) {

        // }
        let uri = await localStorage.getItem('B_URL');
        if (vpnType === 'socks5')
            listUrl = isTM ? TMain_URL + '/nodes?type=Socks5&status=up' : uri + '/client/vpn/socks-list';
        else
            listUrl = isTM ? TMain_URL + '/nodes?type=OpenVPN&status=up' : uri + '/client/vpn/list';
        let response = await axiosInstance.get(listUrl, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            }
        });
        if (response.data.success) {
            return {
                type: types.GET_VPN_LIST_SUCCESS,
                payload: isTM ? response.data.nodes : response.data.list
            }
        } else {
            return {
                type: types.GET_VPN_LIST_PROGRESS,
                payload: []
            }
        }
    } catch (error) {
        return {
            type: types.GET_VPN_LIST_PROGRESS,
            payload: []
        }
    }
}

export function setVpnType(vpnType) {
    localStorage.setItem('VPN_TYPE', vpnType);
    return {
        type: types.SET_VPN_TYPE,
        payload: vpnType
    }
}

export function setVpnStatus(value) {
    return {
        type: types.SET_VPN_STATUS,
        payload: value
    }
}

export function payVPNTM(data) {
    return {
        type: types.TM_PAY_VPN,
        payload: data
    }
}

export async function rateVPNSession(value, cb) {
    try {
        let data = {
            vpn_addr: localStorage.getItem('CONNECTED_VPN'),
            rating: value,
            session_name: localStorage.getItem('SESSION_NAME')
        }
        let response = await axios.post(B_URL + '/client/vpn/rate', data, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
                'Authorization': localStorage.getItem('access_token')
            }
        })
        if (response.data.success) {
            cb(null);
            removeSessionLocal();
        }
        else {
            cb({ message: 'Error occured while submitting rating' });
            removeSessionLocal();
        }
    } catch (error) {
        cb({ message: 'Error occured while submitting rating' });
        removeSessionLocal();
    }
}

export function setActiveVpn(data) {
    return {
        type: types.SET_ACTIVE_VPN,
        payload: data
    }
}

export function setCurrentVpn(data) {
    return {
        type: types.SET_CURRENT_VPN,
        payload: data
    }
}

export function clearUsage() {
    let data = {
        data: {
            success: true,
            usage: {}
        }
    }
    return {
        type: types.VPN_USAGE,
        payload: data
    }
}