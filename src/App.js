import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Button, Col, Form, InputGroup, Row, Alert } from 'react-bootstrap';
function App() {
    const [users, setUsers] = useState([]);
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        mssv: '',
        className: ''
    });
    const endpoint = 'http://localhost:5000/api/users/';
    const fetchUsers = async () => {
        try {
            const response = await axios.get(endpoint);
            if (response)
                setUsers(response.data)

        } catch (error) {
            console.error("Lỗi khi lấy danh sách users:", error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    const handleDelete = async (userId) => {
        try {
            const response = await axios.delete(`${endpoint}${userId}`);
            setTitle(response.data.message);
            setStatus('success');
            fetchUsers();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách users:", error);
        }
    };
    const handleUpdate = async (userId) => {
        try {
            const response = await axios.get(`${endpoint}${userId}`);
            if (typeof response.data === 'object') {
                setFormData(response.data)
                setEditingId(userId);
            }
        } catch (error) {
            console.error(error);
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        const data = {
            ...formData,
            [name]: value
        }
        setFormData(data);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editingId !== null) {
                response = await axios.put(`${endpoint}${editingId}`, formData);
            }
            else {
                response = await axios.post(endpoint, formData);
            }
            setTitle(response.data.message || "Thêm thành công!");
            setStatus('success');
            fetchUsers();
            setFormData({
                fullname: '',
                email: '',
                mssv: '',
                className: ''
            });
        } catch (error) {
            if (error.response) {
                setTitle(error.response.data?.message || "Lỗi không xác định!");
                setStatus('danger');
            } else if (error.request) {
                console.log("Không nhận được phản hồi từ server.");
            } else {
                console.log("Lỗi khi gửi request:", error.message);
            }
        }

    }
    useEffect(() => {
        if (title) {
            const timer = setTimeout(() => {
                setTitle("");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [title]);

    return (
        <Container className=''>
            <h3 className='text-center my-3'>Form Xử Lý Người Dùng Mới</h3>
            {title && <Alert variant={status}>
                {title}
            </Alert>}
            <Form noValidate onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Form.Group as={Col} md="3" controlId="validationCustom01">
                        <Form.Label>Fullname</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="Fullname"
                            name='fullname'
                            onChange={handleChange}
                            value={formData.fullname}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationCustom02">
                        <Form.Label>MSSV</Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="MSSV"
                            name='mssv'
                            onChange={handleChange}
                            value={formData.mssv}
                        />
                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationCustomUsername">
                        <Form.Label>Username</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                name='email'
                                aria-describedby="inputGroupPrepend"
                                onChange={handleChange}
                                value={formData.email}
                                required
                            />
                            <Form.Control.Feedback>
                                Vui lòng nhập đúng email
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationCustomClassname">
                        <Form.Label>Classname</Form.Label>
                        <InputGroup hasValidation>
                            <Form.Control
                                type="text"
                                placeholder="Classname"
                                name='className'
                                aria-describedby="inputGroupPrepend"
                                onChange={handleChange}
                                value={formData.className}
                                required
                            />
                            <Form.Control.Feedback>
                                Vui lòng nhập tên lớp
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Row>
                <Row>
                    <Button type="submit" className='align-center'>Submit form</Button>
                </Row>
            </Form>
            <h3 className='text-center my-4'>Danh Sách Người Dùng</h3>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Fullname</th>
                        <th>MSSV</th>
                        <th>Email</th>
                        <th>Classname</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users ?
                        users.map(user => (
                            < tr key={user.id} >
                                <td>{user.id}</td>
                                <td>{user.fullname}</td>
                                <td>{user.mssv}</td>
                                <td>{user.email}</td>
                                <td>{user.className}</td>
                                <td>
                                    <Button className='mx-2' onClick={() => handleDelete(user.id)}>Xoa</Button>
                                    <Button onClick={() => handleUpdate(user.id)}>Sua</Button>
                                </td>
                            </tr>
                        ))
                        :
                        <tr>
                            <h3>Khong co user nao</h3>
                        </tr>
                    }

                </tbody>
            </Table>
        </Container >
    );
}

export default App;
