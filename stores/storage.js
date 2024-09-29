import { defineStore } from 'pinia'

export const useStorageStore = defineStore('storage', {
    state: () => ({
        isChecked: false,
        domain: '',
        generalScore: null,
        dnsScore: null,
        certificateScore: null,
        ipqsScore: null,
        pros: [],
        cons: [],
    }),
    actions: {
        toggleChecked() {
            this.isChecked = !this.isChecked
        },
        setChecked(value) {
            this.isChecked = value
        },
        setValue(key, value) {
            this[key] = value
        }
    },
    getters: {
        isCheckedState: (state) => state.isChecked,
        generalScoreState: (state) => state.generalScore,
        dnsScoreState: (state) => state.dnsScore,
        certificateScoreState: (state) => state.certificateScore,
        ipqsScoreState: (state) => state.ipqsScore,
    },
});
