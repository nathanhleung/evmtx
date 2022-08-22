type TransactionProp = {
    address: string;
    inputData: string;

}


export default function SubmitTx() {
    return (
        <div className="SubmitTx">
            <form>
                <label>
                    Address:
                    <input type="text" name="address"/>
                </label>  <br></br>
                <label>
                    Input Data:
                    <textarea name="inputData" />
                </label> <br></br>
                <label>
                    From :
                    <input type="text" name="from" placeholder="0x0000000000000000000000000000000000000000" defaultValue="0x0000000000000000000000000000000000000000"/>
                </label> <br></br>
                <label>
                    Gas:
                    <input type="number" name="Gas" placeholder="0" defaultValue={0} />
                </label> <br></br>
                <label>
                    Gas Price:
                    <input type="number" name="GasPrice" placeholder="0" defaultValue={0} />
                </label> <br></br>
                <label>
                    Value:
                    <input type="number" name="Value" placeholder="0" defaultValue={0} />
                </label>
                <br></br>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}