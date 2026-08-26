# Fine-Tuning Small Language Models (SLMs) for Efficient Module Classification

In modern cybersecurity awareness platforms, recommending relevant learning content to employees requires precise, low-latency text classification. While massive frontier models (e.g. 70B+ parameter LLMs) produce highly accurate zero-shot categorizations, deploying them in production for real-time recommendation engines introduces significant cost overhead and latency challenges.

This post shares operational insights and technical benchmarks from fine-tuning **Small Language Models (SLMs)** (such as Phi-3, Qwen-2 1.5B/7B, and Llama-3 8B) for specialized cybersecurity content classification.

---

## The Challenge

Our recommendation engine categorizes incoming training modules, compliance policies, and threat updates into granular domain taxonomies (e.g., *Phishing*, *Ransomware*, *Data Privacy*, *Social Engineering*).

The operational goals were clear:
1. **Low Latency**: Sub-100ms response time per request.
2. **High Precision & Recall**: >95% F1-score across 25+ fine-grained categories.
3. **Cost Efficiency**: Deployable on single-GPU or lightweight CPU inference instances.

---

## Technical Approach

### 1. Parameter-Efficient Fine-Tuning (PEFT / LoRA)

Instead of updating all weights during training, we leveraged **Low-Rank Adaptation (LoRA)** on targeted attention projection matrices (`q_proj`, `v_proj`).

```python
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from peft import LoraConfig, get_peft_model, TaskType

model_id = "meta-llama/Meta-Llama-3-8B"
tokenizer = AutoTokenizer.from_pretrained(model_id)

peft_config = LoraConfig(
    task_type=TaskType.SEQ_CLS,
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"]
)

model = AutoModelForSequenceClassification.from_pretrained(
    model_id, 
    num_labels=28
)
model = get_peft_model(model, peft_config)
model.print_trainable_parameters()
```

### 2. Dataset Curation & Distillation

We utilized larger frontier LLMs (GPT-4 / Claude 3.5 Sonnet) as teacher models to generate high-quality labeled synthetic training samples for under-represented cybersecurity categories, combined with human-verified compliance documents.

### 3. Quantization & Deployment

To achieve maximum inference speed:
- Merged LoRA adapters back into base weights.
- Exported the model to **ONNX Runtime** and **vLLM / TensorRT-LLM**.
- Applied **INT8 FP16 quantization**.

---

## Results & Impact

- **Latency**: Reduced average classification latency from **1.4s (API-based LLM)** down to **42ms (Quantized SLM on T4 GPU)**.
- **Accuracy**: Achieved **96.8% macro F1-score**, exceeding zero-shot baseline by **4.2%**.
- **Cost Reduction**: Slashing operational cloud inference costs by over **85%**.

Fine-tuning Small Language Models proves that domain-specific specialization consistently beats massive generalist models in latency, cost, and task precision.
