import styled from "styled-components"

export type TxOverviewProps = {
  from: string
  to: string
  txIndex: number
}

export default function TxOverview(props: TxOverviewProps) {
  return (
    <Wrapper>
      <tr>
        <td> Transaction Index : {props.txIndex} </td>
        <td> From : {props.from} </td>
        <td> To : {props.to} </td>
      </tr>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  background: papayawhip;
`
