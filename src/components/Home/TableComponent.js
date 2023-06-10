import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

const TableComponent = ({ userEmail }) => {
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('./data/emirs.json', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDropdownSelect = (eventKey,event) => {
    setSelectedOption(eventKey);
    const selectedItemText = event.target.innerText;
    setSelectedItem(selectedItemText);
  };
  
  const TemelAlanPuans = () => {
    const groupARow = data.find((item) => item['TITLE2'] === 'GRUP A - TOPLAM NUMBER');
    const totalPoints = parseFloat(groupARow['NUMBER3']);
    const weightedPoints = (totalPoints * 0.3) / 100;
  
    groupARow['NUMBER4'] = weightedPoints.toFixed(2);
  
    setData([...data]);
  };

  
  const calToplamPuan = () => {
    let ToplamPuans = 0;

    data.forEach((item) => {
      if (item['TITLE2'] !== 'GRUP A - TOPLAM NUMBER') {
        const adetsaatdon = parseFloat(item['NUMBER2']);
        const puanss = parseFloat(item.NUMBER);
  
        if (!isNaN(adetsaatdon) && !isNaN(puanss)) {
          const calculatedPoints = adetsaatdon * puanss;
          ToplamPuans += calculatedPoints;
          item['NUMBER3'] = calculatedPoints;
        } else {
          item['NUMBER3'] = '';
        }
      }
    });
  
    const groupARow = data.find((item) => item['TITLE2'] === 'GRUP A - TOPLAM NUMBER');
    groupARow['NUMBER3'] = ToplamPuans;
  
    setData([...data]);
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedData = [...data];
    updatedData[index][name] = value;
    updatedData[index]['NUMBER3'] = value * updatedData[index].NUMBER;
    setData(updatedData);
    calToplamPuan();
    TemelAlanPuans();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isFormValid = data.every((item) => {
      return item['NUMBER2'].trim() !== '' || item.NUMBER === 0 || item.NUMBER === '';
    }
    );

    if (isFormValid && selectedOption !== '') {
      console.log('Form is valid');
      console.log('Selected Option:', selectedOption);
      console.log(data);
      try {
        const response = await fetch('/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data, userEmail, selectedOption }),
        });
        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.log('Error sending email:', error);
      }
    } else {
      console.log('Form is not valid');
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
      <Dropdown style={{ marginBottom: '10px' }} onSelect={handleDropdownSelect}>
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
          {selectedItem !== '' ? selectedItem : 'Dekanlığınızı Seçiniz...'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="test@test.com">Mail 1</Dropdown.Item>
            <Dropdown.Item eventKey="test1@test2.com">Mail 2</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Table striped responsive hover style={{ borderRadius: '5px', overflow: 'hidden' }}>
          <thead>
            <tr>
              <th>TITLE</th>
              <th>TITLE2</th>
              <th>TITLE3</th>
              <th>NUMBER</th>
              <th>NUMBER2</th>
              <th>NUMBER3</th>
              <th>NUMBER4 </th>
              <th>TITLE4</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.TITLE}</td>
                <td>{item['TITLE2']}</td>
                <td>{item['TITLE3']}</td>
                <td>{item.NUMBER}</td>
                {item.NUMBER ? (
                  <td>
                    <input
                      className='felans'
                      type="text"
                      name="NUMBER2"
                      value={item['NUMBER2']}
                      onChange={(e) => handleInputChange(e, index)}
                      required
                    />
                  </td>
                ) : (
                  <td></td>
                )}
                <td>{item['NUMBER3']}</td>
                <td>{item['NUMBER4']}</td>
                <td>{item['TITLE4']}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="success" as="input" type="submit" value="Gönder" />
      </Form>
    </div>
  );
};

export default TableComponent;
