export async function onRequest(context) {
	const secret = context.env.FORMSPREE_ID;
  
	return new Response(JSON.stringify({ secret }), {
	  headers: { 'Content-Type': 'application/json' }
	});
  }
  