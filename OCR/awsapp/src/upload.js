import React, { Component } from 'react';
import FileBase64 from 'react-file-base64';
import { Form, FormGroup, Button, Label, FormText, Input, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"
import axios from "axios";
import "./upload.css";


class Upload extends Component {

    constructor(props) {
        super(props)

        this.state = {
            confirmation: "",
            files: "",
            ppsn: "",
            lambdaReturn: "",
            lastName: "",
            firstName: "",
            ppsnPresent: false,
            lastNamePresent: false,
            firstNamePresent: false,
            disabled: true,
            dropDownOpen: false,
            dropDownValue: "",
            visible: false,
        };
    }

    refreshPage = () => {
        window.location.reload();
    }

    handleChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        const name = e.target.name
        this.setState({ [name]: value })
    }

    _onKeyUp = () => {
        let regex = /[0-9]{7}[A-Za-z]{1}$/g;
        const { ppsn } = this.state
        ppsn.match(regex) ? this.setState({ disabled: false }) : this.setState({ disabled: true })
    }

    // testClick = () => {
    //     alert.show('Oh look, an alert!')
    // }


    async getFiles(files) {
        const { ppsn, firstName, lastName } = this.state
        this.setState({
            files,
            confirmation: "Processing"
        })

        const UID = Math.round(1 + Math.random() * (1000000 - 1));

        var data = {
            fileExt: "png",
            imageID: UID,
            folder: UID,
            ppsn,
            firstName,
            lastName,
            img: this.state.files.base64
        };


        await axios("https://6velcmlhx7.execute-api.us-east-1.amazonaws.com/Production", {
            method: "POST",
            data
        })
            .then(res => {
                console.log("s3", res)
            })
            .catch(error => {
                console.log(error)
            });


        axios("https://6velcmlhx7.execute-api.us-east-1.amazonaws.com/Production/ocr", {

            method: "POST",
            data,
        })
            .then(res => {
                console.log("OCR", res)
                const response = res.data.body
                this.setState({ lambdaReturn: response[0] })

                ppsn !== "" && this.setState({ ppsnPresent: response[1] })
                firstName !== "" && this.setState({ firstNamePresent: response[2] })
                lastName !== "" && this.setState({ lastNamePresent: response[3] })
            })

            .catch(error => {
                console.log(error)
                alert("Please refresh the browser and try again")
            });
        this.setState({ confirmation: "" })

    }

    toggle = () => {
        if (this.state.dropDownOpen === false) {
            this.setState({ dropDownOpen: true })
        } else { this.setState({ dropDownOpen: false }) }

    }

    selectDD = (e) => {
        this.setState({ dropDownValue: e.currentTarget.textContent })
        console.log(this.state.dropDownValue)
    }

    render() {
        const { ppsnPresent, lastNamePresent, firstNamePresent, confirmation, dropDownValue, dropDownOpen, disabled } = this.state
        return (
            <div className="container" style={marginTop10}>
                <div className="mt-3" >
                    <div >
                        <Form  >
                            <Button style={boiButton} type="reset" value="Reset" className=" btn btn-primary btn-md" onClick={this.refreshPage}> New Search </Button>
                            <FormGroup>
                                <Label for="ppsn" style={marginTop10}>
                                    <h5 style={boiText}> PPSN <span style={{ color: "red" }} > * </span></h5>
                                    <Input
                                        style={{ width: "300px" }}
                                        type="text"
                                        name="ppsn"
                                        id="ppsn"
                                        placeholder="(e.g. 1234567P)"
                                        onChange={this.handleChange}
                                        onKeyUp={this._onKeyUp}
                                    />
                                    <h6 style={boiText}> PPSN PRESENT . . .  </h6>
                                    <Label >
                                        <input
                                            type="checkbox"
                                            checked={ppsnPresent}
                                            onChange={this.handleChange}
                                        />
                                    </Label>
                                </Label>
                            </FormGroup>

                            <FormGroup>
                                <Label for="lastName">
                                    <h5 style={boiText}> LAST NAME</h5>
                                    <Input
                                        style={{ width: "300px" }}
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        placeholder="(Bloggs)"
                                        onChange={this.handleChange}
                                        disabled={disabled}
                                    />
                                    <h6 style={boiText}> LAST NAME PRESENT . . .  </h6>
                                    <Label check>
                                        <input
                                            type="checkbox"
                                            checked={lastNamePresent}
                                            onChange={this.handleChange}
                                        />
                                    </Label>
                                </Label>
                            </FormGroup>

                            <FormGroup>
                                <Label for="firstName">
                                    <h5 style={boiText}> FIRST NAME </h5>
                                    <Input
                                        style={{ width: "300px" }}
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        placeholder="(Joe)"
                                        onChange={this.handleChange}
                                        disabled={disabled}
                                    />

                                    <h6 style={boiText}> FIRST NAME PRESENT . . .  </h6>
                                    <Label>
                                        <input
                                            style={{ borderWidth: "100px" }}
                                            type="checkbox"
                                            checked={firstNamePresent}
                                            onChange={this.handleChange}
                                        />
                                    </Label>
                                </Label>
                            </FormGroup>

                            <Dropdown isOpen={dropDownOpen} toggle={this.toggle}>
                                <DropdownToggle style={boiButton} caret>

                                    {dropDownValue !== "" ? dropDownValue : "Select Document Type"}

                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem header>P60/Payslip/Revenue Letter/Social Welfare</DropdownItem>
                                    <DropdownItem onClick={this.selectDD} style={boiButton}>P60</DropdownItem>
                                    <DropdownItem onClick={this.selectDD} style={boiButton}>Payslip</DropdownItem>

                                    <DropdownItem onClick={this.selectDD} style={boiButton}>Revenue Document</DropdownItem>
                                    <DropdownItem onClick={this.selectDD} style={boiButton}>Social Welfare Letter</DropdownItem>
                                    <DropdownItem onClick={this.selectDD} style={boiButton}>N/A</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>

                            <FormGroup>
                                <h3 className="text-danger"> {confirmation} </h3>
                                <h4 style={boiText}> Upload Invoice </h4>
                                <FormText color="muted"> PNG, JPG </FormText>
                                <div className="form-group files color">
                                    <FileBase64 mulitple={true}
                                        onDone={this.getFiles.bind(this)}> </FileBase64>
                                </div>
                            </FormGroup>

                        </Form>
                    </div>
                </div >
            </div >
        );
    }
}

const marginTop10 = { marginTop: "10px" };
const boiBackgroundColor = { backgroundColor: "#0085b0" }
const boiButton = { backgroundColor: "#106988", color: "white" }
const boiColor = { color: "#0085b0" }
const boiText = { color: "#053c59", fontFamily: "Open-Sans", fontWeight: "bold" }
const boiOutline = { borderColor: "#0085b0" }
export default Upload;