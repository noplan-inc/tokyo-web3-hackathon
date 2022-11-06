import type { NextPage } from "next";
import {
  Heading,
  Button,
  Box,
  Select,
  Input,
  FormLabel,
  Switch,
  Image,
  Textarea,
  Divider,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import axios from "axios";



const Debug: NextPage = () => {
    const [value, setValue] = useState("");

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    };

    const [result, setResult] = useState({});

    const submit = async () =>{
        console.log('value')
        console.log(value)
        await axios.get(`${process.env.NEXT_PUBLIC_LN_URL}/pay?invoice=${value}`).then((res)=>{
            console.log('res')
            console.log(res)
            setResult(res.data?.ok)
        }).catch((err)=>{
            console.log(err)
            alert(`error. see console log.`)
        })

    }
    return (
        <>
            <h1>Fill your invoice.</h1>
            <Input onChange={handleInputChange} />
            <Button onClick={submit}>Submit</Button>
            {JSON.stringify(result)}
        </>
    )
}
export default Debug;