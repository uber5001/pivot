Math.sin = function(x: number) {
	function mod(a: number, b: number) {
		return (a%b+b)%b;
	}
	x = mod(x + Math.PI/2, Math.PI*2) - Math.PI/2;
	if (x > Math.PI/2) x = Math.PI - x;
	x = x - x*x*x/6 + x*x*x*x*x/120 - x*x*x*x*x*x*x/5040 + x*x*x*x*x*x*x*x*x/362880;
	return x;
}
Math.cos = function(x: number) {
	return Math.sin(x + Math.PI/2);
}