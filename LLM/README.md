# Fantasy Toolz LLM

We've been thinking about an LLM for fantasy baseball for a bit now.

Inspired by [this tutorial](https://github.com/joelgrus/rag-from-household-objects?tab=readme-ov-file), we've set up a local LLM for Fantasy Toolz. We're using [Retrieval-Augmented Generation](https://aws.amazon.com/what-is/retrieval-augmented-generation/) to seed our info in the LLM. We're using [SentenceTransformers](https://www.sbert.net/index.html) to encode the tokens from our repositories. The LLM is powered by [Ollama](https://ollama.com), specifically the fairly lightweight [phi3.5](https://ollama.com/library/phi3.5).

To get started, run `ollama run llama3.2` in the terminal. If you do not have a specific model, this will also download it for you. Then try
```
>>> Who are you?
I'm an artificial intelligence model known as Llama. Llama stands for "Large Language Model Meta AI."
```

For python interoperability, you will also want `python3.11 -m pip install -U sentence-transformers` and `python3.11 -m pip install ollama`.