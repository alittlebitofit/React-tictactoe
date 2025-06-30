import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
	return <button className={`square ${highlight}`} onClick={onSquareClick}>{value}</button>;
}

function Board({xIsNext, squares, onPlay}) {

	function handleClick(i) {
		if (squares[i] || calculateWinner(squares)) {
			return;
		}
		const nextSquares = squares.slice();
		if (xIsNext) {
			nextSquares[i] = "X";
		} else {
			nextSquares[i] = "O";
		}

		onPlay(nextSquares);
	}

	const winner = calculateWinner(squares);
	let status;
	if (winner) {
		status = "Winner: " + winner[0];
	} else if (!squares.includes(null)) {
		status = "Draw";
	} else {
		status = "Next player: " + (xIsNext ? "X" : "O");
	}

	return (
		<>
			<div className="status">{status}</div>
			{[0, 1, 2].map((row) => (
				<div className="board-row" key={row}>
					{[0, 1, 2].map((col) => {
						const index = row * 3 + col;
						return (
							<Square
								key={index}
								value={squares[index]}

								onSquareClick={() => handleClick(index)}

								highlight={winner?.[1].includes(index) ? "winning-square" : ""}
							/>
						)
					})}
				</div>
			))}
		</>
	);
}



export default function Game() {

	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];

	const [isDescending, setIsDescending] = useState(false);

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpToMove(nextMove) {
		setCurrentMove(nextMove);
	}

	let moves = history.map((squares, move) => {

		const previousSquares = history[move - 1];
		const presentSquares = history[move];
		let row;
		let col;
		if (previousSquares) {
			let index;
			for (let i = 0; i < previousSquares.length; i++) {
				if (previousSquares[i] !== presentSquares[i]) {
					index = i;
					break;
				}
			}

			row = Math.floor((index) / 3);
			col = (index) % 3;
		}

		let description;
		if (move === currentMove) {
			if (move === 0) {
				description = 'You are at move #0';
			} else {
				description = 'You are at move #' + move + `, (${row}, ${col})`;
			}
			return <li key={move}>{description}</li>
		} else if (move > 0) {
			description = 'Go to move #' + move + `, (${row}, ${col})`;
		} else {
			description = 'Go to game start';
		}

		return (
			<li key={move}><button onClick={() => jumpToMove(move)}>{description}</button></li>
		)
	});

	if (isDescending) {
		moves = moves.reverse();
	}

	return (
		<div className='game'>
			<div className='game-board'>
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>

			<div className='game-info'>
				<label>Sort Descending: 
					<input
						type="checkbox"
						checked={isDescending}
						onChange={(e) => {
							setIsDescending(e.target.checked);
						}}
					/>
				</label>
				<ol>{moves}
				</ol>
			</div>
		</div>
	);
}


function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];

	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [squares[a], [a, b, c]];
		}
	}

	return null;
}
