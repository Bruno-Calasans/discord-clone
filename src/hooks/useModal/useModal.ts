/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import { useStore } from "zustand"
import modalStore from "./modalStore"

export default function useModal() {
  return useStore(modalStore)
}
