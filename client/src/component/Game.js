import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { reportResult } from '../action/auth';
import Countdown from './Countdown';
import $ from 'jquery';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Image,
} from 'react-bootstrap';
import { ArrowRightSquare, ArrowLeftSquare } from 'react-bootstrap-icons';

//image
import congrats from '../images/speed/congrats.jpg';
import img0 from '../images/speed/img0.jpg';
import img1 from '../images/speed/img1.jpg';
import img2 from '../images/speed/img2.jpg';
import img3 from '../images/speed/img3.jpg';
import img4 from '../images/speed/img4.jpg';

const Game = ({ auth, reportResult }) => {
  const [img, setImg] = useState(img0);
  const [play, setPlay] = useState(false);
  const [pause, setPause] = useState(false);
  const [sumary, setSumary] = useState(false);
  const [swapPage, setSwapPage] = useState(false);
  const [score, setScore] = useState(0);
  const [times, setTimes] = useState(1);
  const [currentImg, setCurrentImg] = useState(0);
  const [tmp, setTmp] = useState(0);
  const mapImages = [img0, img1, img2, img3, img4];
  const randomNumber = () => {
    return Math.floor(Math.random() * 4) + 1;
  };

  const compare = (pre, current) => {
    if (pre === current) {
      return 'ArrowRight';
    } else {
      return 'ArrowLeft';
    }
  };

  const onKeyPress = async (e) => {
    e.preventDefault();
    if (!play && sumary) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const number = randomNumber();
      await setImg(mapImages[number]);
      await runEffect();
      const result = compare(currentImg, tmp);
      if (
        (e.key === 'ArrowRight' || e.key === 'ArrowLeft') &&
        currentImg === 0
      ) {
        setScore(10);
        setTimes(times + 1);
        setCurrentImg(number);
        setTmp(currentImg);
      } else if (e.key === result) {
        setScore(score + 10 * times);
        setTimes(times + 1 > 10 ? times : times + 1);
        setCurrentImg(number);
        setTmp(currentImg);
      } else {
        setTimes(1);
        setScore(score > 10 ? score - 20 : score === 0 ? score : score - 10);
        setCurrentImg(number);
        setTmp(currentImg);
      }
    }
  };

  const sumarry = () => {
    setPlay(false);
    setPause(true);
    setSumary(true);

    const payload = {
      username: auth.user.name,
      unit: auth.user.unit,
      score: score,
    };

    reportResult(payload);
  };

  const closeResult = () => {
    setPause(false);
    setSwapPage(true);
  };

  if (swapPage) {
    return <Redirect to='/ranking' />;
  }

  const runEffect = () => {
    $('#effect').fadeIn('fast', () => {
      setTimeout(() => {
        $('#effect').removeAttr('style').hide().fadeIn();
      }, 10);
    });
  };

  return (
    <div
      className='bg-main-game'
      id='main-game'
      onKeyDown={onKeyPress}
      tabIndex='0'
    >
      <Container fluid>
        <div className='header'>
          Time:
          {play ? (
            <Countdown sumarry={() => sumarry()} />
          ) : (
            <span className='ml-3'>{'00:00'}</span>
          )}
          {' | '} Score:
          <span className='ml-3'>{score}</span>
          {' | '} {`x ${times}`}
        </div>
        <div className='guide'>
          <div>Bức hình HIỆN TẠI có trùng khớp với bức hình </div>
          <div>đã hiển thị ra TRƯỚC ĐÓ không?</div>
        </div>
        <Row>
          <Col xs={3}></Col>
          <Col xs={6}>
            <div className='part2' id='effect'>
              <Card style={{ width: '100%', height: '20rem' }} className='mb-2'>
                <Card.Body>
                  <Card.Img src={img} />
                </Card.Body>
              </Card>
            </div>
          </Col>
          <Col xs={3}></Col>
        </Row>
        <div className='footer'>
          {!play && (
            <Button
              variant='danger'
              onClick={() => {
                setPlay(true);
                document.getElementById('main-game').focus();
              }}
            >
              START
            </Button>
          )}
        </div>
        <div className='footer'>
          <span style={{ marginRight: '10px' }}>No</span>
          <ArrowLeftSquare />
          {' | '}
          <ArrowRightSquare />
          <span style={{ marginLeft: '10px' }}>Yes</span>
        </div>
        <div className='note'>
          Sử dụng các nút qua trái, qua phải của bàn phím không sử dụng chuột
        </div>
      </Container>
      <Modal show={pause} size='sm' centered>
        <Modal.Body>
          <Image src={congrats} fluid />
          <div className='congrat'>
            <h4>{`Your Score: ${score}`}</h4>
          </div>
          <div className='footer' style={{ textAlign: 'center' }}>
            <Button variant='danger' onClick={() => closeResult()}>
              OK
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

Game.propTypes = {
  reportResult: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { reportResult })(Game);
