import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styles from '../styles/cats.module.css'
import { Button, Modal } from '@mantine/core';

//crud对接strapi

const CatsPage = () => {
    const [cats, setCats] = useState([]);
    const [selectedCat, setSelectedCat] = useState({ cat_name: '', cat_age: '', cat_addr: '' });
    const [editingCatId, setEditingCatId] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [catToDelete, setCatToDelete] = useState(null);

    // 使用 useCallback 包裹 loadCats 函数
    const loadCats = useCallback(async () => {
        try {
            const response = await axios.get('/api/cats');
            console.log("================",response)
            setCats(response.data);
            resetForm();
        } catch (err) {
            console.error(err);
        }
    }, []); // 如果内部没有依赖除了状态和props之外的东西，依赖项数组可以为空

    // 更新 useEffect，添加 loadCats 作为依赖项
    useEffect(() => {
        loadCats();
    }, [loadCats]); // 现在 useEffect 会在 loadCats 函数变化时触发

    const createCat = async () => {
        try {console.log("=========",selectedCat)
            await axios.post('/api/cats', selectedCat);
            loadCats();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteCat = async (id:any) => {
        try {
            await axios.delete(`/api/cats/${id}`);
            loadCats();
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async () => {
        if (editingCatId === null) {
            createCat();
        } else {
            updateCat();
        }
    };
    
    const updateCat = async () => {
        try {
            await axios.put(`/api/cats/${editingCatId}`, selectedCat);
            loadCats();
            setEditingCatId(null); // Reset the editing mode
            setSelectedCat({ cat_name: '', cat_age: '', cat_addr: '' }); // Clear the form
        } catch(err) {
            console.error(err);
        }
    };
    
    const startEditing = (cat:any) => {
        setEditingCatId(cat.id);
        setSelectedCat({
            cat_name: cat.attributes.cat_name,
            cat_age: cat.attributes.cat_age,
            cat_addr: cat.attributes.cat_addr
        });
    };

    const resetForm = () => {
        setSelectedCat({cat_name: '', cat_age: '', cat_addr: ''});
        setEditingCatId(null); // Reset editing mode
    };

    const handleDelete = (catId:any) => {
        setCatToDelete(catId); // 保存将要删除的猫的id
        setIsModalOpen(true); // 显示确认删除的对话框
    }

    const confirmDelete = () => {
        // 这里是你的删除逻辑
        // 可以使用 catToDelete 这个值
        deleteCat(catToDelete)
        // 然后关闭对话框
        setIsModalOpen(false);
      };
    
      const cancelDelete = () => {
        // 取消删除，关闭对话框
        setIsModalOpen(false);
      };

    return (
        <div>
            <h1>Cats</h1>
            <table className={styles.myTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {cats.map((cat:any) => (
                        <tr key={cat.id}>
                            <td>{cat.id}</td>
                            <td>{cat.attributes.cat_name}</td>
                            <td>{cat.attributes.cat_age}</td>
                            <td>{cat.attributes.cat_addr}</td>
                            <td>
                                <button onClick={() => startEditing(cat)}>Edit</button> &nbsp;
                                {/* <button onClick={() => deleteCat(cat.id)}>Delete</button> */}
                                <button onClick={() => handleDelete(cat.id)}>Delete</button>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Create Cat</h2>
            <div>
                <label>Cat Name:</label>
                <input type="text" onChange={e => setSelectedCat({...selectedCat, cat_name: e.target.value })} value={selectedCat.cat_name}/>
            </div>
            <div>
                <label>Cat Age:</label>
                <input
                    type="number"
                    onChange={e => setSelectedCat({ ...selectedCat, cat_age: e.target.value })}
                    value={selectedCat.cat_age !== undefined ? selectedCat.cat_age : ''}
                />
            </div>
            <div>
                <label>Cat Address:</label>
                <input type="text" onChange={e => setSelectedCat({...selectedCat, cat_addr: e.target.value })} value={selectedCat.cat_addr}/>
            </div>
            <button onClick={handleSubmit}>{editingCatId === null ? 'Create' : 'Update'}</button> 
            &nbsp; |  &nbsp;
            <button onClick={resetForm}>Reset</button> {/* Add this line */}


            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="确认删除？"
                withCloseButton={false}
            >
                <p>你确定要删除这个项目吗？操作无法撤回。</p>
                <div style={{ textAlign: 'right', marginTop: '25px' }}>
                <Button color="blue" onClick={confirmDelete} style={{ marginRight: '10px' }}>确定</Button>
                <Button color="gray" onClick={cancelDelete}>取消</Button>
                </div>
            </Modal>
        </div>
    );
};

export default CatsPage;